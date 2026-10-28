// Database seed script - Run with: npm run db:seed

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@savera.ai' },
    update: {},
    create: {
      email: 'admin@savera.ai',
      passwordHash: adminPassword,
      name: 'System Administrator',
      role: 'ADMIN'
    }
  });
  console.log('✅ Admin user created:', admin.email);

  // Create facility managers
  const managerPassword = await bcrypt.hash('manager123', 10);
  const managers = [];
  
  for (const [name, email] of [
    ['Rajesh Kumar', 'rajesh@savera.ai'],
    ['Priya Sharma', 'priya@savera.ai'],
    ['Amit Patel', 'amit@savera.ai']
  ]) {
    const manager = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        passwordHash: managerPassword,
        name,
        role: 'FACILITY_MANAGER'
      }
    });
    managers.push(manager);
    console.log('✅ Manager created:', manager.email);
  }

  // Create campus
  const campus = await prisma.campus.upsert({
    where: { id: 'campus-north' },
    update: {},
    create: {
      id: 'campus-north',
      name: 'North Region Campus',
      location: 'New Delhi, India'
    }
  });
  console.log('✅ Campus created:', campus.name);

  // Create buildings
  const buildings = [];
  const buildingData = [
    { name: 'Building A — Academic Block', location: 'North Campus', type: 'ACADEMIC', floors: 4, occupancy: 320, managerId: managers[0].id },
    { name: 'Building B — Hostel', location: 'East Campus', type: 'RESIDENTIAL', floors: 6, occupancy: 450, managerId: managers[1].id },
    { name: 'Building C — Admin Office', location: 'Central Campus', type: 'OFFICE', floors: 3, occupancy: 120, managerId: managers[2].id }
  ];

  for (const data of buildingData) {
    const building = await prisma.building.upsert({
      where: { id: data.name.toLowerCase().replace(/\s+/g, '-').slice(0, 20) },
      update: {},
      create: {
        id: data.name.toLowerCase().replace(/\s+/g, '-').slice(0, 20),
        ...data,
        campusId: campus.id
      }
    });
    buildings.push(building);
    console.log('✅ Building created:', building.name);
  }

  // Create anomaly thresholds
  const thresholds = [
    { severity: 'LOW', deviationPercent: 10 },
    { severity: 'MEDIUM', deviationPercent: 15 },
    { severity: 'HIGH', deviationPercent: 25 },
    { severity: 'CRITICAL', deviationPercent: 50 }
  ];

  for (const threshold of thresholds) {
    await prisma.anomalyThreshold.create({ data: threshold });
  }
  console.log('✅ Anomaly thresholds created');

  // Create sample contacts
  const contacts = [
    { name: 'Arun Mehta', phone: '+919876543201', buildingId: buildings[0].id, floor: '1' },
    { name: 'Sneha Reddy', phone: '+919876543202', buildingId: buildings[0].id, floor: '2' },
    { name: 'Vikram Singh', phone: '+919876543203', buildingId: buildings[1].id, floor: '1' },
    { name: 'Deepa Nair', phone: '+919876543204', buildingId: buildings[1].id, floor: '3' },
    { name: 'Karan Joshi', phone: '+919876543205', buildingId: buildings[2].id, floor: '1' },
    { name: 'Rahul Gupta', phone: '+919876543206', buildingId: buildings[1].id, floor: '2' },
    { name: 'Anita Desai', phone: '+919876543207', buildingId: buildings[2].id, floor: '2' }
  ];

  for (const contact of contacts) {
    await prisma.contact.create({
      data: { ...contact, isVerified: true, hasOptedIn: true }
    });
  }
  console.log('✅ Sample contacts created');

  // Generate simulated energy readings (last 7 days)
  console.log('📊 Generating simulated energy readings...');
  const readings = [];
  const now = new Date();

  for (const building of buildings) {
    for (let d = 7; d >= 0; d--) {
      for (let h = 0; h < 24; h++) {
        const timestamp = new Date(now);
        timestamp.setDate(timestamp.getDate() - d);
        timestamp.setHours(h, 0, 0, 0);

        let baseConsumption = building.type === 'RESIDENTIAL' ? 20 : 
                             building.type === 'ACADEMIC' ? 30 : 15;
        
        if (h >= 8 && h <= 18) {
          baseConsumption *= 1.5 + Math.sin((h - 8) / 10 * Math.PI) * 0.5;
        } else {
          baseConsumption *= 0.3;
        }

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

  await prisma.energyReading.createMany({ data: readings, skipDuplicates: true });
  console.log(`✅ Generated ${readings.length} energy readings`);

  console.log('\n🎉 Database seeded successfully!');
  console.log('\n📋 Login credentials:');
  console.log('   Admin: admin@savera.ai / admin123');
  console.log('   Manager: rajesh@savera.ai / manager123');
  console.log('   Manager: priya@savera.ai / manager123');
  console.log('   Manager: amit@savera.ai / manager123');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
