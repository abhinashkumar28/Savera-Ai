// Savera AI Backend - Main Server
// Complete API with authentication, SMS integration, and anomaly detection

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { z } = require('zod');
const multer = require('multer');
const { parse } = require('csv-parse/sync');
const axios = require('axios');
const winston = require('winston');

// ============ INITIALIZATION ============

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// ============ LOGGING ============

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

// ============ MIDDLEWARE ============

app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(morgan('combined'));

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { error: 'Too many requests, please try again later' }
});
app.use('/api/', apiLimiter);

// Stricter rate limit for SMS
const smsLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50,
  message: { error: 'SMS rate limit exceeded' }
});

// File upload
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

// ============ AUTHENTICATION MIDDLEWARE ============

const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, role: true, name: true, isActive: true }
    });

    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'Invalid or inactive user' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
};

// ============ AUDIT LOG HELPER ============

const auditLog = async (userId, action, resource, resourceId, details, req) => {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        resource,
        resourceId,
        details,
        ipAddress: req.ip,
        userAgent: req.get('user-agent')
      }
    });
  } catch (error) {
    logger.error('Failed to create audit log', error);
  }
};

// ============ AUTH ROUTES ============

app.post('/api/auth/register', async (req, res) => {
  try {
    const schema = z.object({
      email: z.string().email(),
      password: z.string().min(8),
      name: z.string().min(2),
      role: z.enum(['ADMIN', 'FACILITY_MANAGER', 'STAFF']).optional()
    });

    const data = schema.parse(req.body);
    
    const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(data.password, 10);
    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        name: data.name,
        role: data.role || 'STAFF'
      }
    });

    await auditLog(user.id, 'REGISTER', 'User', user.id, { email: user.email }, req);
    logger.info(`User registered: ${user.email}`);

    res.status(201).json({
      message: 'Registration successful',
      user: { id: user.id, email: user.email, name: user.name, role: user.role }
    });
  } catch (error) {
    logger.error('Registration error', error);
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const schema = z.object({
      email: z.string().email(),
      password: z.string()
    });

    const data = schema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email: data.email } });

    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(data.password, user.passwordHash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' });

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    });

    await auditLog(user.id, 'LOGIN', 'User', user.id, null, req);
    logger.info(`User logged in: ${user.email}`);

    res.json({
      token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role }
    });
  } catch (error) {
    logger.error('Login error', error);
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/auth/me', authenticate, async (req, res) => {
  res.json({ user: req.user });
});

// ============ BUILDINGS ROUTES ============

app.get('/api/buildings', authenticate, async (req, res) => {
  try {
    const buildings = await prisma.building.findMany({
      include: {
        campus: true,
        manager: { select: { id: true, name: true, email: true } }
      },
      orderBy: { name: 'asc' }
    });
    res.json(buildings);
  } catch (error) {
    logger.error('Get buildings error', error);
    res.status(500).json({ error: 'Failed to fetch buildings' });
  }
});

app.post('/api/buildings', authenticate, authorize('ADMIN', 'FACILITY_MANAGER'), async (req, res) => {
  try {
    const schema = z.object({
      name: z.string().min(2),
      location: z.string(),
      type: z.enum(['ACADEMIC', 'RESIDENTIAL', 'OFFICE', 'INDUSTRIAL', 'OTHER']),
      floors: z.number().int().positive(),
      occupancy: z.number().int().positive(),
      managerId: z.string().optional(),
      campusId: z.string()
    });

    const data = schema.parse(req.body);
    const building = await prisma.building.create({ data });

    await auditLog(req.user.id, 'CREATE', 'Building', building.id, data, req);
    logger.info(`Building created: ${building.name}`);

    res.status(201).json(building);
  } catch (error) {
    logger.error('Create building error', error);
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/buildings/:id', authenticate, authorize('ADMIN', 'FACILITY_MANAGER'), async (req, res) => {
  try {
    const building = await prisma.building.update({
      where: { id: req.params.id },
      data: req.body
    });

    await auditLog(req.user.id, 'UPDATE', 'Building', building.id, req.body, req);
    res.json(building);
  } catch (error) {
    logger.error('Update building error', error);
    res.status(400).json({ error: error.message });
  }
});

// ============ ENERGY READINGS ROUTES ============

app.get('/api/readings', authenticate, async (req, res) => {
  try {
    const { buildingId, startDate, endDate, limit = 1000 } = req.query;
    
    const where = {};
    if (buildingId) where.buildingId = buildingId;
    if (startDate || endDate) {
      where.timestamp = {};
      if (startDate) where.timestamp.gte = new Date(startDate);
      if (endDate) where.timestamp.lte = new Date(endDate);
    }

    const readings = await prisma.energyReading.findMany({
      where,
      orderBy: { timestamp: 'desc' },
      take: parseInt(limit)
    });

    res.json(readings);
  } catch (error) {
    logger.error('Get readings error', error);
    res.status(500).json({ error: 'Failed to fetch readings' });
  }
});

app.post('/api/readings/import', authenticate, authorize('ADMIN', 'FACILITY_MANAGER'), upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const csvContent = req.file.buffer.toString('utf-8');
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });

    const readings = [];
    const errors = [];

    for (let i = 0; i < records.length; i++) {
      const record = records[i];
      try {
        const reading = {
          buildingId: record.building_id,
          timestamp: new Date(record.timestamp),
          consumptionKwh: parseFloat(record.consumption_kwh),
          temperature: record.temperature ? parseFloat(record.temperature) : null,
          occupancy: record.occupancy ? parseInt(record.occupancy) : null,
          dayOfWeek: record.day_of_week || null,
          isHoliday: record.is_holiday === 'true',
          dataSource: 'CSV_IMPORT'
        };

        // Validate
        if (!reading.buildingId || isNaN(reading.consumptionKwh)) {
          throw new Error('Invalid data');
        }

        readings.push(reading);
      } catch (err) {
        errors.push({ row: i + 2, error: err.message });
      }
    }

    // Bulk create
    const result = await prisma.energyReading.createMany({
      data: readings,
      skipDuplicates: true
    });

    await auditLog(req.user.id, 'IMPORT', 'EnergyReading', null, { 
      count: result.count, 
      errors: errors.length 
    }, req);

    logger.info(`Imported ${result.count} readings`);

    res.json({
      message: 'Import completed',
      imported: result.count,
      errors
    });
  } catch (error) {
    logger.error('Import readings error', error);
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/readings/simulate', authenticate, authorize('ADMIN'), async (req, res) => {
  try {
    const { days = 30, buildingIds } = req.body;
    const buildings = buildingIds 
      ? await prisma.building.findMany({ where: { id: { in: buildingIds } } })
      : await prisma.building.findMany();

    const readings = [];
    const now = new Date();

    for (const building of buildings) {
      for (let d = days; d >= 0; d--) {
        for (let h = 0; h < 24; h++) {
          const timestamp = new Date(now);
          timestamp.setDate(timestamp.getDate() - d);
          timestamp.setHours(h, 0, 0, 0);

          // Simulate realistic patterns
          let baseConsumption = building.type === 'RESIDENTIAL' ? 20 : 
                               building.type === 'ACADEMIC' ? 30 : 15;
          
          if (h >= 8 && h <= 18) {
            baseConsumption *= 1.5 + Math.sin((h - 8) / 10 * Math.PI) * 0.5;
          } else {
            baseConsumption *= 0.3;
          }

          // Add randomness
          baseConsumption *= 0.9 + Math.random() * 0.2;

          readings.push({
            buildingId: building.id,
            timestamp,
            consumptionKwh: Math.round(baseConsumption * 10) / 10,
            temperature: 20 + Math.random() * 10,
            occupancy: Math.floor(building.occupancy * (h >= 8 && h <= 18 ? 0.7 : 0.1)),
            dayOfWeek: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][timestamp.getDay()],
            isHoliday: false,
            dataSource: 'SIMULATED'
          });
        }
      }
    }

    const result = await prisma.energyReading.createMany({
      data: readings,
      skipDuplicates: true
    });

    await auditLog(req.user.id, 'SIMULATE', 'EnergyReading', null, { count: result.count }, req);
    logger.info(`Generated ${result.count} simulated readings`);

    res.json({ message: 'Simulation completed', count: result.count });
  } catch (error) {
    logger.error('Simulate readings error', error);
    res.status(400).json({ error: error.message });
  }
});

// ============ ANOMALY DETECTION ============

// Anomaly detection service
class AnomalyDetector {
  static async detectAnomalies(buildingId, hours = 24) {
    const now = new Date();
    const startTime = new Date(now.getTime() - hours * 60 * 60 * 1000);

    // Get recent readings
    const readings = await prisma.energyReading.findMany({
      where: {
        buildingId,
        timestamp: { gte: startTime }
      },
      orderBy: { timestamp: 'asc' }
    });

    if (readings.length < 10) {
      return [];
    }

    // Calculate baseline (average consumption for same hour over past week)
    const baselines = await this.calculateBaselines(buildingId);
    
    const anomalies = [];
    const thresholds = await prisma.anomalyThreshold.findMany({
      where: { isActive: true }
    });

    for (const reading of readings) {
      const hour = reading.timestamp.getHours();
      const baseline = baselines[hour] || this.getOverallAverage(readings);
      
      if (!baseline) continue;

      const deviation = reading.consumptionKwh - baseline;
      const deviationPercent = (deviation / baseline) * 100;

      // Determine severity
      let severity = null;
      for (const threshold of thresholds.sort((a, b) => b.deviationPercent - a.deviationPercent)) {
        if (Math.abs(deviationPercent) >= threshold.deviationPercent) {
          severity = threshold.severity;
          break;
        }
      }

      if (severity) {
        anomalies.push({
          buildingId,
          timestamp: reading.timestamp,
          actualKwh: reading.consumptionKwh,
          expectedKwh: baseline,
          deviationKwh: deviation,
          deviationPercent,
          severity,
          explanation: this.generateExplanation(reading, baseline, deviationPercent),
          possibleCause: this.identifyPossibleCause(reading, deviationPercent)
        });
      }
    }

    return anomalies;
  }

  static async calculateBaselines(buildingId) {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const readings = await prisma.energyReading.findMany({
      where: {
        buildingId,
        timestamp: { gte: oneWeekAgo }
      }
    });

    const hourlyAverages = {};
    for (let h = 0; h < 24; h++) {
      const hourReadings = readings.filter(r => r.timestamp.getHours() === h);
      if (hourReadings.length > 0) {
        hourlyAverages[h] = hourReadings.reduce((sum, r) => sum + r.consumptionKwh, 0) / hourReadings.length;
      }
    }

    return hourlyAverages;
  }

  static getOverallAverage(readings) {
    if (readings.length === 0) return null;
    return readings.reduce((sum, r) => sum + r.consumptionKwh, 0) / readings.length;
  }

  static generateExplanation(reading, baseline, deviationPercent) {
    const hour = reading.timestamp.getHours();
    const timeOfDay = hour >= 22 || hour < 6 ? 'nighttime' : 
                     hour >= 8 && hour <= 18 ? 'daytime' : 'evening';
    
    return `${timeOfDay.charAt(0).toUpperCase() + timeOfDay.slice(1)} consumption is ${Math.abs(deviationPercent).toFixed(1)}% ${deviationPercent > 0 ? 'above' : 'below'} the expected baseline of ${baseline.toFixed(1)} kWh.`;
  }

  static identifyPossibleCause(reading, deviationPercent) {
    const hour = reading.timestamp.getHours();
    
    if (hour >= 22 || hour < 6) {
      return 'HVAC system left running overnight or lighting schedule misconfiguration.';
    } else if (deviationPercent > 50) {
      return 'Possible equipment malfunction or unauthorized use of high-load appliances.';
    } else if (deviationPercent > 25) {
      return 'Extended occupancy beyond scheduled hours or inefficient equipment usage.';
    } else {
      return 'Normal fluctuation or minor schedule deviation.';
    }
  }
}

app.post('/api/anomalies/detect', authenticate, authorize('ADMIN', 'FACILITY_MANAGER'), async (req, res) => {
  try {
    const { buildingId, hours = 24 } = req.body;
    
    const buildings = buildingId 
      ? [await prisma.building.findUnique({ where: { id: buildingId } })]
      : await prisma.building.findMany();

    const allAnomalies = [];

    for (const building of buildings) {
      const anomalies = await AnomalyDetector.detectAnomalies(building.id, hours);
      
      // Save anomalies to database
      for (const anomaly of anomalies) {
        const saved = await prisma.anomaly.create({ data: anomaly });
        allAnomalies.push(saved);

        // Auto-generate recommendations for HIGH and CRITICAL
        if (['HIGH', 'CRITICAL'].includes(anomaly.severity)) {
          await this.generateRecommendations(saved);
        }
      }
    }

    await auditLog(req.user.id, 'DETECT', 'Anomaly', null, { count: allAnomalies.length }, req);
    logger.info(`Detected ${allAnomalies.length} anomalies`);

    res.json({ count: allAnomalies.length, anomalies: allAnomalies });
  } catch (error) {
    logger.error('Detect anomalies error', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/anomalies', authenticate, async (req, res) => {
  try {
    const { buildingId, severity, status, limit = 100 } = req.query;
    
    const where = {};
    if (buildingId) where.buildingId = buildingId;
    if (severity) where.severity = severity;
    if (status) where.status = status;

    const anomalies = await prisma.anomaly.findMany({
      where,
      include: {
        building: { select: { id: true, name: true } },
        recommendations: true
      },
      orderBy: { timestamp: 'desc' },
      take: parseInt(limit)
    });

    res.json(anomalies);
  } catch (error) {
    logger.error('Get anomalies error', error);
    res.status(500).json({ error: 'Failed to fetch anomalies' });
  }
});

app.put('/api/anomalies/:id/status', authenticate, async (req, res) => {
  try {
    const { status, notes } = req.body;
    
    const updateData = { status };
    if (status === 'ACKNOWLEDGED') {
      updateData.acknowledgedAt = new Date();
      updateData.acknowledgedBy = req.user.id;
    } else if (status === 'RESOLVED') {
      updateData.resolvedAt = new Date();
      updateData.resolvedBy = req.user.id;
    } else if (status === 'DISMISSED') {
      updateData.dismissedAt = new Date();
      updateData.dismissedBy = req.user.id;
    }
    if (notes) updateData.notes = notes;

    const anomaly = await prisma.anomaly.update({
      where: { id: req.params.id },
      data: updateData
    });

    await auditLog(req.user.id, 'UPDATE_STATUS', 'Anomaly', anomaly.id, { status }, req);
    res.json(anomaly);
  } catch (error) {
    logger.error('Update anomaly status error', error);
    res.status(400).json({ error: error.message });
  }
});

// ============ RECOMMENDATIONS ============

async function generateRecommendations(anomaly) {
  const recommendations = [];
  
  // Generate based on anomaly characteristics
  const hour = anomaly.timestamp.getHours();
  const deviation = anomaly.deviationKwh;
  
  let action, reason;
  
  if (hour >= 22 || hour < 6) {
    action = 'Verify HVAC timer settings and ensure automatic shutoff during unoccupied hours';
    reason = 'Nighttime consumption anomaly suggests systems running during unoccupied hours.';
  } else if (deviation > 20) {
    action = 'Inspect equipment for malfunction and review usage patterns';
    reason = 'Significant deviation indicates potential equipment issue or policy violation.';
  } else {
    action = 'Review occupancy schedules and adjust equipment usage accordingly';
    reason = 'Moderate deviation suggests schedule misalignment.';
  }

  const estimatedSavingsKwh = deviation * 0.7; // Assume 70% is recoverable
  const estimatedSavingsRs = estimatedSavingsKwh * 8; // ₹8 per kWh

  const recommendation = await prisma.recommendation.create({
    data: {
      anomalyId: anomaly.id,
      action,
      reason,
      priority: anomaly.severity === 'CRITICAL' ? 'HIGH' : 'MEDIUM',
      estimatedSavingsKwh,
      estimatedSavingsRs,
      status: 'PENDING'
    }
  });

  return recommendation;
}

app.get('/api/recommendations', authenticate, async (req, res) => {
  try {
    const { status, buildingId } = req.query;
    
    const where = {};
    if (status) where.status = status;

    const recommendations = await prisma.recommendation.findMany({
      where,
      include: {
        anomaly: {
          include: {
            building: { select: { id: true, name: true } }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(recommendations);
  } catch (error) {
    logger.error('Get recommendations error', error);
    res.status(500).json({ error: 'Failed to fetch recommendations' });
  }
});

app.put('/api/recommendations/:id/status', authenticate, async (req, res) => {
  try {
    const { status } = req.body;
    
    const updateData = { status };
    if (status === 'ACCEPTED') {
      updateData.acceptedAt = new Date();
      updateData.acceptedBy = req.user.id;
    } else if (status === 'REJECTED') {
      updateData.rejectedAt = new Date();
    } else if (status === 'COMPLETED') {
      updateData.completedAt = new Date();
    }

    const recommendation = await prisma.recommendation.update({
      where: { id: req.params.id },
      data: updateData
    });

    await auditLog(req.user.id, 'UPDATE_STATUS', 'Recommendation', recommendation.id, { status }, req);
    res.json(recommendation);
  } catch (error) {
    logger.error('Update recommendation error', error);
    res.status(400).json({ error: error.message });
  }
});

// ============ TASKS ============

app.get('/api/tasks', authenticate, async (req, res) => {
  try {
    const { assigneeId, status, buildingId } = req.query;
    
    const where = {};
    if (assigneeId) where.assigneeId = assigneeId;
    if (status) where.status = status;
    if (buildingId) where.buildingId = buildingId;

    const tasks = await prisma.task.findMany({
      where,
      include: {
        building: { select: { id: true, name: true } },
        assignee: { select: { id: true, name: true, email: true } },
        creator: { select: { id: true, name: true } }
      },
      orderBy: { dueDate: 'asc' }
    });

    res.json(tasks);
  } catch (error) {
    logger.error('Get tasks error', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

app.post('/api/tasks', authenticate, async (req, res) => {
  try {
    const schema = z.object({
      title: z.string().min(5),
      description: z.string().optional(),
      buildingId: z.string(),
      anomalyId: z.string().optional(),
      assigneeId: z.string(),
      priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
      dueDate: z.string().optional()
    });

    const data = schema.parse(req.body);
    const task = await prisma.task.create({
      data: {
        ...data,
        creatorId: req.user.id,
        dueDate: data.dueDate ? new Date(data.dueDate) : null
      }
    });

    await auditLog(req.user.id, 'CREATE', 'Task', task.id, data, req);
    res.status(201).json(task);
  } catch (error) {
    logger.error('Create task error', error);
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/tasks/:id', authenticate, async (req, res) => {
  try {
    const task = await prisma.task.update({
      where: { id: req.params.id },
      data: req.body
    });

    await auditLog(req.user.id, 'UPDATE', 'Task', task.id, req.body, req);
    res.json(task);
  } catch (error) {
    logger.error('Update task error', error);
    res.status(400).json({ error: error.message });
  }
});

// ============ SMS SERVICE (INDIA COMPLIANT) ============

class SMSService {
  constructor() {
    this.provider = process.env.SMS_PROVIDER || 'demo'; // 'msg91', 'twilio', or 'demo'
    this.validateCompliance = this.validateCompliance.bind(this);
  }

  // India-specific DLT compliance validation
  async validateCompliance(message, recipientPhone) {
    const violations = [];

    // 1. Check message length (single SMS = 160 chars)
    if (message.length > 160) {
      violations.push('Message exceeds 160 characters (multi-SMS)');
    }

    // 2. Check for prohibited content
    const prohibitedWords = ['lottery', 'winner', 'free', 'click here'];
    for (const word of prohibitedWords) {
      if (message.toLowerCase().includes(word)) {
        violations.push(`Message contains prohibited word: ${word}`);
      }
    }

    // 3. Check time restrictions (9 PM - 9 AM not allowed for promotional)
    const hour = new Date().getHours();
    if (hour >= 21 || hour < 9) {
      violations.push('SMS sending not allowed between 9 PM and 9 AM');
    }

    // 4. Validate phone number format (Indian numbers)
    if (!/^\+91\d{10}$/.test(recipientPhone)) {
      violations.push('Invalid Indian phone number format (should be +91XXXXXXXXXX)');
    }

    return {
      compliant: violations.length === 0,
      violations
    };
  }

  // Get eligible recipients (verified, opted-in, active)
  async getEligibleRecipients(buildingId) {
    return await prisma.contact.findMany({
      where: {
        buildingId,
        isVerified: true,
        hasOptedIn: true,
        isActive: true
      }
    });
  }

  // Send SMS via provider
  async sendSMS(phone, message, senderId, templateId) {
    // Compliance check
    const compliance = await this.validateCompliance(message, phone);
    if (!compliance.compliant) {
      throw new Error(`Compliance violation: ${compliance.violations.join(', ')}`);
    }

    if (this.provider === 'demo') {
      // Demo mode - simulate sending
      logger.info(`[DEMO] SMS to ${phone}: ${message}`);
      return {
        success: true,
        messageId: `demo_${Date.now()}`,
        cost: 0.15 // ₹0.15 per SMS
      };
    }

    if (this.provider === 'msg91') {
      // MSG91 integration
      const response = await axios.post('https://api.msg91.com/api/v5/flow/', {
        sender: senderId,
        route: '4', // Transactional route
        country: '91',
        sms: [{
          message,
          to: [phone.replace('+91', '')]
        }]
      }, {
        headers: {
          authkey: process.env.MSG91_AUTH_KEY,
          'Content-Type': 'application/json'
        }
      });

      return {
        success: response.data.type === 'success',
        messageId: response.data.request_id,
        cost: 0.15
      };
    }

    if (this.provider === 'twilio') {
      // Twilio integration
      const twilio = require('twilio')(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
      );

      const message = await twilio.messages.create({
        body: message,
        from: senderId,
        to: phone
      });

      return {
        success: true,
        messageId: message.sid,
        cost: 0.15
      };
    }

    throw new Error(`Unknown SMS provider: ${this.provider}`);
  }

  // Send bulk SMS with campaign tracking
  async sendBulkSMS(campaignId, recipients, message, senderId, templateId) {
    const results = [];
    let totalCost = 0;

    for (const recipient of recipients) {
      try {
        const result = await this.sendSMS(recipient.phone, message, senderId, templateId);
        
        await prisma.sMSRecord.create({
          data: {
            campaignId,
            contactId: recipient.id,
            status: 'SENT',
            providerMessageId: result.messageId,
            cost: result.cost
          }
        });

        totalCost += result.cost;
        results.push({ contactId: recipient.id, success: true, messageId: result.messageId });
      } catch (error) {
        await prisma.sMSRecord.create({
          data: {
            campaignId,
            contactId: recipient.id,
            status: 'FAILED',
            failureReason: error.message
          }
        });

        results.push({ contactId: recipient.id, success: false, error: error.message });
      }
    }

    await prisma.sMSCampaign.update({
      where: { id: campaignId },
      data: {
        status: 'SENT',
        sentAt: new Date(),
        totalCost
      }
    });

    return results;
  }
}

const smsService = new SMSService();

// SMS Routes
app.post('/api/sms/campaigns', authenticate, authorize('ADMIN', 'FACILITY_MANAGER'), smsLimiter, async (req, res) => {
  try {
    const schema = z.object({
      buildingId: z.string(),
      message: z.string().min(10).max(160),
      templateId: z.string().optional(), // DLT template ID
      senderId: z.string().regex(/^[A-Z]{6}$/), // 6-letter sender ID
      recipientFilter: z.enum(['ALL', 'SPECIFIC']).optional()
    });

    const data = schema.parse(req.body);

    // Get eligible recipients
    const recipients = await smsService.getEligibleRecipients(data.buildingId);
    
    if (recipients.length === 0) {
      return res.status(400).json({ error: 'No eligible recipients found' });
    }

    // Create campaign
    const campaign = await prisma.sMSCampaign.create({
      data: {
        buildingId: data.buildingId,
        message: data.message,
        templateId: data.templateId,
        senderId: data.senderId,
        recipientCount: recipients.length,
        initiatedBy: req.user.id,
        status: 'QUEUED'
      }
    });

    // Send SMS (async)
    smsService.sendBulkSMS(campaign.id, recipients, data.message, data.senderId, data.templateId)
      .then(() => logger.info(`SMS campaign ${campaign.id} completed`))
      .catch(err => logger.error(`SMS campaign ${campaign.id} failed`, err));

    await auditLog(req.user.id, 'CREATE', 'SMSCampaign', campaign.id, {
      recipientCount: recipients.length,
      message: data.message
    }, req);

    res.status(201).json({
      campaign,
      recipientCount: recipients.length,
      message: 'Campaign queued for sending'
    });
  } catch (error) {
    logger.error('Create SMS campaign error', error);
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/sms/campaigns', authenticate, async (req, res) => {
  try {
    const campaigns = await prisma.sMSCampaign.findMany({
      include: {
        user: { select: { id: true, name: true } },
        records: {
          select: { status: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(campaigns);
  } catch (error) {
    logger.error('Get SMS campaigns error', error);
    res.status(500).json({ error: 'Failed to fetch campaigns' });
  }
});

// ============ CONTACTS ============

app.get('/api/contacts', authenticate, async (req, res) => {
  try {
    const { buildingId } = req.query;
    
    const where = buildingId ? { buildingId } : {};
    
    const contacts = await prisma.contact.findMany({
      where,
      include: {
        building: { select: { id: true, name: true } }
      },
      orderBy: { name: 'asc' }
    });

    res.json(contacts);
  } catch (error) {
    logger.error('Get contacts error', error);
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
});

app.post('/api/contacts', authenticate, authorize('ADMIN', 'FACILITY_MANAGER'), async (req, res) => {
  try {
    const schema = z.object({
      name: z.string().min(2),
      phone: z.string().regex(/^\+91\d{10}$/),
      buildingId: z.string(),
      floor: z.string().optional()
    });

    const data = schema.parse(req.body);
    const contact = await prisma.contact.create({ data });

    await auditLog(req.user.id, 'CREATE', 'Contact', contact.id, data, req);
    res.status(201).json(contact);
  } catch (error) {
    logger.error('Create contact error', error);
    res.status(400).json({ error: error.message });
  }
});

// ============ REPORTS ============

app.get('/api/reports/summary', authenticate, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();

    // Get buildings
    const buildings = await prisma.building.findMany();

    // Calculate totals
    const totalConsumption = await prisma.energyReading.aggregate({
      where: { timestamp: { gte: start, lte: end } },
      _sum: { consumptionKwh: true }
    });

    const anomalyCount = await prisma.anomaly.count({
      where: { timestamp: { gte: start, lte: end } }
    });

    const savings = await prisma.recommendation.aggregate({
      where: { status: 'COMPLETED' },
      _sum: { verifiedSavingsRs: true, verifiedSavingsKwh: true }
    });

    const smsCampaigns = await prisma.sMSCampaign.count({
      where: { createdAt: { gte: start, lte: end } }
    });

    res.json({
      period: { start, end },
      buildings: buildings.length,
      totalConsumptionKwh: totalConsumption._sum.consumptionKwh || 0,
      estimatedCost: (totalConsumption._sum.consumptionKwh || 0) * 8,
      anomalies: anomalyCount,
      verifiedSavingsKwh: savings._sum.verifiedSavingsKwh || 0,
      verifiedSavingsRs: savings._sum.verifiedSavingsRs || 0,
      smsCampaigns
    });
  } catch (error) {
    logger.error('Get report summary error', error);
    res.status(500).json({ error: 'Failed to generate report' });
  }
});

// ============ SETTINGS ============

app.get('/api/settings/thresholds', authenticate, async (req, res) => {
  try {
    const thresholds = await prisma.anomalyThreshold.findMany({
      orderBy: { deviationPercent: 'asc' }
    });
    res.json(thresholds);
  } catch (error) {
    logger.error('Get thresholds error', error);
    res.status(500).json({ error: 'Failed to fetch thresholds' });
  }
});

app.post('/api/settings/thresholds', authenticate, authorize('ADMIN'), async (req, res) => {
  try {
    const schema = z.object({
      severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
      deviationPercent: z.number().positive(),
      buildingType: z.enum(['ACADEMIC', 'RESIDENTIAL', 'OFFICE', 'INDUSTRIAL', 'OTHER']).optional(),
      timeOfDay: z.string().optional()
    });

    const data = schema.parse(req.body);
    const threshold = await prisma.anomalyThreshold.create({ data });

    await auditLog(req.user.id, 'CREATE', 'AnomalyThreshold', threshold.id, data, req);
    res.status(201).json(threshold);
  } catch (error) {
    logger.error('Create threshold error', error);
    res.status(400).json({ error: error.message });
  }
});

// ============ AUDIT LOGS ============

app.get('/api/audit-logs', authenticate, authorize('ADMIN'), async (req, res) => {
  try {
    const { limit = 100, action, resource } = req.query;
    
    const where = {};
    if (action) where.action = action;
    if (resource) where.resource = resource;

    const logs = await prisma.auditLog.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true } }
      },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit)
    });

    res.json(logs);
  } catch (error) {
    logger.error('Get audit logs error', error);
    res.status(500).json({ error: 'Failed to fetch audit logs' });
  }
});

// ============ HEALTH CHECK ============

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ============ ERROR HANDLING ============

app.use((err, req, res, next) => {
  logger.error('Unhandled error', err);
  res.status(500).json({ error: 'Internal server error' });
});

// ============ START SERVER ============

app.listen(PORT, () => {
  logger.info(`Savera AI Backend running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`SMS Provider: ${process.env.SMS_PROVIDER || 'demo'}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  await prisma.$disconnect();
  process.exit(0);
});
