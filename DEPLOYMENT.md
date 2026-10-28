# Savera AI - Complete Deployment Guide

## 🎯 Overview

Savera AI is a full-stack intelligent energy monitoring platform with:
- **Frontend**: React + Vite + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express + PostgreSQL + Prisma
- **SMS Integration**: MSG91/Twilio (India DLT compliant)
- **Authentication**: JWT-based with role-based access control
- **AI Features**: Anomaly detection, forecasting, recommendations

---

## 📦 Backend Setup

### Prerequisites
- Node.js 18+ 
- PostgreSQL 14+
- npm or yarn

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/savera_ai"
JWT_SECRET="generate-a-secure-random-string"
SMS_PROVIDER=demo  # or 'msg91' or 'twilio'
```

### 3. Setup Database
```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed initial data
npm run db:seed
```

### 4. Start Backend Server
```bash
# Development
npm run dev

# Production
npm start
```

Backend will run on `http://localhost:5000`

---

## 🎨 Frontend Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create `.env` in frontend root:
```env
VITE_API_URL=http://localhost:5000/api
VITE_DEMO_MODE=false  # Set to 'false' to use real backend
```

### 3. Start Development Server
```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

---

## 📱 SMS Integration (India Compliance)

### MSG91 Setup (Recommended for India)

1. **Register on MSG91**: https://msg91.com
2. **DLT Registration**: Register your entity on DLT platform
3. **Get Sender ID**: Apply for 6-letter sender ID (e.g., "SAVERA")
4. **Template Approval**: Submit SMS templates for approval
5. **Get Auth Key**: Copy from MSG91 dashboard

Update `.env`:
```env
SMS_PROVIDER=msg91
MSG91_AUTH_KEY=your_auth_key_here
MSG91_SENDER_ID=SAVERA
MSG91_TEMPLATE_ID=your_template_id
```

### DLT Compliance Features
- ✅ Message length validation (160 chars)
- ✅ Time restrictions (9 PM - 9 AM blocked)
- ✅ Prohibited content filtering
- ✅ Phone number format validation (+91XXXXXXXXXX)
- ✅ Consent management (opt-in/opt-out)
- ✅ Template ID tracking
- ✅ Audit logs for all SMS campaigns

### Twilio Setup (Alternative)
```env
SMS_PROVIDER=twilio
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_PHONE_NUMBER=+1234567890
```

---

## 🔐 Default Login Credentials

After running `npm run db:seed`:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@savera.ai | admin123 |
| Manager | rajesh@savera.ai | manager123 |
| Manager | priya@savera.ai | manager123 |
| Manager | amit@savera.ai | manager123 |

**⚠️ Change these passwords immediately in production!**

---

## 🚀 Production Deployment

### Backend (Railway/Render/Heroku)

1. **Set environment variables** in your hosting platform
2. **Provision PostgreSQL** database
3. **Run migrations**: `npm run db:push`
4. **Seed data**: `npm run db:seed`
5. **Start server**: `npm start`

### Frontend (Vercel/Netlify)

1. **Set environment variables**:
   - `VITE_API_URL=https://your-backend-url.com/api`
   - `VITE_DEMO_MODE=false`
2. **Build**: `npm run build`
3. **Deploy**: Upload `dist/` folder

### Database (Supabase/Neon/PlanetScale)

Use managed PostgreSQL with connection string in `DATABASE_URL`

---

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Buildings
- `GET /api/buildings` - List all buildings
- `POST /api/buildings` - Create building (Admin/Manager)
- `PUT /api/buildings/:id` - Update building

### Energy Readings
- `GET /api/readings` - Get readings with filters
- `POST /api/readings/import` - Import CSV file
- `POST /api/readings/simulate` - Generate simulated data

### Anomalies
- `POST /api/anomalies/detect` - Run anomaly detection
- `GET /api/anomalies` - List anomalies
- `PUT /api/anomalies/:id/status` - Update status

### Recommendations
- `GET /api/recommendations` - List recommendations
- `PUT /api/recommendations/:id/status` - Accept/Reject/Complete

### Tasks
- `GET /api/tasks` - List tasks
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task

### SMS
- `POST /api/sms/campaigns` - Send SMS campaign
- `GET /api/sms/campaigns` - List campaigns

### Contacts
- `GET /api/contacts` - List contacts
- `POST /api/contacts` - Add contact

### Reports
- `GET /api/reports/summary` - Get summary report

### Settings
- `GET /api/settings/thresholds` - Get anomaly thresholds
- `POST /api/settings/thresholds` - Create threshold

### Audit Logs
- `GET /api/audit-logs` - Get audit logs (Admin only)

---

## 🛡️ Security Features

- ✅ JWT authentication with 24h expiry
- ✅ Role-based access control (Admin, Manager, Staff)
- ✅ Password hashing with bcrypt
- ✅ Rate limiting (100 req/15min general, 50/hr for SMS)
- ✅ CORS protection
- ✅ Helmet security headers
- ✅ Audit logging for sensitive actions
- ✅ Input validation with Zod
- ✅ SQL injection protection (Prisma ORM)

---

## 🧪 Demo Mode

The frontend works in **demo mode by default** using localStorage:
- No backend required
- All data stored in browser
- Perfect for testing and demos

Set `VITE_DEMO_MODE=false` to use real backend.

---

## 📈 Database Schema

Key models:
- **User** - Authentication & roles
- **Building** - Campus structures
- **EnergyReading** - Consumption data
- **Anomaly** - Detected issues
- **Recommendation** - AI suggestions
- **Task** - Action items
- **Contact** - SMS recipients
- **SMSCampaign** - Message campaigns
- **AuditLog** - Activity tracking
- **AnomalyThreshold** - Detection rules

---

## 🔧 Troubleshooting

### Backend won't start
- Check PostgreSQL is running
- Verify `DATABASE_URL` in `.env`
- Run `npm run db:generate`

### SMS not sending
- Verify SMS provider credentials
- Check DLT registration (India)
- Review audit logs for compliance errors

### Frontend can't connect
- Verify `VITE_API_URL` matches backend URL
- Check CORS settings in backend
- Ensure backend is running

---

## 📞 Support

For issues or questions:
- Check logs in `backend/logs/`
- Review API responses in browser DevTools
- Verify environment variables

---

## 🎉 You're Ready!

Your Savera AI platform is now fully functional with:
- ✅ Real backend API
- ✅ Database persistence
- ✅ SMS integration (India compliant)
- ✅ Authentication & authorization
- ✅ AI anomaly detection
- ✅ Complete audit trail

**Next steps:**
1. Change default passwords
2. Configure SMS provider
3. Deploy to production
4. Monitor logs regularly
