# 🌅 Savera AI - Intelligent Energy Monitoring Platform

A complete full-stack AI-powered energy monitoring platform with real-time anomaly detection, forecasting, SMS alerts, and comprehensive building management.

![Savera AI](https://img.shields.io/badge/Savera-AI-E5CD82?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-4169E1?style=flat-square&logo=postgresql)

---

## ✨ Features

### 🏢 Building Management
- Multi-building campus management
- Per-building energy tracking
- Facility manager assignments
- Occupancy and floor management

### 📊 Energy Monitoring
- Real-time consumption tracking
- Hourly, daily, weekly, monthly views
- Building-wise comparisons
- Peak usage identification
- Cost estimation (₹/kWh)

### 🤖 AI-Powered Anomaly Detection
- Automatic unusual consumption detection
- Severity-based alerts (Low, Medium, High, Critical)
- Explainable AI with root cause analysis
- Configurable thresholds
- Historical anomaly tracking

### 🔮 Forecasting
- Predictive consumption models
- 48-hour and 7-day forecasts
- Forecast vs actual comparison
- MAE (Mean Absolute Error) tracking
- Early wastage identification

### 💡 Smart Recommendations
- Actionable suggestions for every anomaly
- Estimated savings (kWh and ₹)
- Priority-based action items
- Accept/Reject/Complete workflow
- Verified savings tracking

### 📱 SMS Alerts & Notifications
- **India DLT Compliant** (TRAI regulations)
- One-click anomaly notifications
- Bulk messaging campaigns
- Template-based messages
- Delivery tracking
- Consent management (opt-in/opt-out)
- Time restrictions (9 PM - 9 AM blocked)
- Prohibited content filtering

### ✅ Task Management
- Create tasks from anomalies
- Assign to facility managers
- Priority and due date tracking
- Status management (Open → In Progress → Completed)
- Resolution notes and verification

### 📈 Reports & Analytics
- Building-wise consumption reports
- Anomaly frequency analysis
- Savings verification (estimated vs actual)
- SMS campaign delivery reports
- Exportable summaries

### 🔐 Security & Authentication
- JWT-based authentication
- Role-based access control (Admin, Manager, Staff)
- Building-level permissions
- Audit logs for all sensitive actions
- Password hashing (bcrypt)
- Rate limiting

---

## 🏗️ Architecture

```
savera-ai/
├── frontend/              # React + Vite + TypeScript
│   ├── src/
│   │   ├── api/          # API client
│   │   ├── components/   # Reusable UI components
│   │   ├── context/      # Auth context
│   │   ├── pages/        # Page components
│   │   ├── data/         # Mock data (demo mode)
│   │   └── utils/        # Utilities
│   └── package.json
│
├── backend/               # Node.js + Express
│   ├── prisma/           # Database schema
│   │   ├── schema.prisma
│   │   └── seed.js
│   ├── server.js         # Main server
│   ├── package.json
│   └── .env.example
│
├── DEPLOYMENT.md          # Deployment guide
└── README.md             # This file
```

---

## 🚀 Quick Start

### Frontend (Demo Mode)

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:5173
```

The frontend works in **demo mode by default** with simulated data.

### Backend (Full Stack)

```bash
cd backend

# Install dependencies
npm install

# Configure environment (set GEMINI_API_KEY for the voice assistant)
cp .env.example .env
# Edit .env with your Gemini API key and other required settings

# Setup database
npm run db:generate
npm run db:push
npm run db:seed

# Start server
npm run dev
```

Backend runs on `http://localhost:3001`

### Connect Frontend to Backend

The frontend's Vite development server proxies `/api` requests to the backend. The floating assistant supports typed and spoken conversations in English, Hindi, and Hinglish. See [backend setup and Gemini quota instructions](./backend/README.md).

---

## 🔑 Default Credentials

After running `npm run db:seed`:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@savera.ai | admin123 |
| Manager | rajesh@savera.ai | manager123 |
| Manager | priya@savera.ai | manager123 |
| Manager | amit@savera.ai | manager123 |

**⚠️ Change these immediately in production!**

---

## 📱 SMS Integration

### MSG91 (India - Recommended)

1. Register at [MSG91](https://msg91.com)
2. Complete DLT registration
3. Get 6-letter sender ID (e.g., "SAVERA")
4. Submit SMS templates for approval
5. Update `.env`:

```env
SMS_PROVIDER=msg91
MSG91_AUTH_KEY=your_auth_key
MSG91_SENDER_ID=SAVERA
MSG91_TEMPLATE_ID=your_template_id
```

### Twilio (International)

```env
SMS_PROVIDER=twilio
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_PHONE_NUMBER=+1234567890
```

### DLT Compliance Features

- ✅ Message length validation (160 chars)
- ✅ Time restrictions (9 PM - 9 AM blocked)
- ✅ Prohibited content filtering
- ✅ Phone number format validation
- ✅ Consent management
- ✅ Template ID tracking
- ✅ Audit logs

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Recharts** - Data visualization
- **Lucide React** - Icons

### Backend
- **Node.js + Express** - API server
- **PostgreSQL** - Database
- **Prisma** - ORM
- **JWT** - Authentication
- **Zod** - Validation
- **Winston** - Logging
- **MSG91/Twilio** - SMS providers

---

## 📊 Database Schema

Key models:
- **User** - Authentication & roles
- **Building** - Campus structures
- **EnergyReading** - Consumption data
- **Anomaly** - Detected issues
- **Recommendation** - AI suggestions
- **Task** - Action items
- **Contact** - SMS recipients
- **SMSCampaign** - Message campaigns
- **SMSRecord** - Individual message status
- **AuditLog** - Activity tracking
- **AnomalyThreshold** - Detection rules
- **Forecast** - Predicted consumption

---

## 🔒 Security

- JWT authentication (24h expiry)
- Role-based access control
- Password hashing (bcrypt)
- Rate limiting (100 req/15min)
- CORS protection
- Helmet security headers
- Input validation (Zod)
- SQL injection protection (Prisma)
- Audit logging

---

## 📖 API Documentation

### Authentication
- `POST /api/auth/register` - Register
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Current user

### Buildings
- `GET /api/buildings` - List buildings
- `POST /api/buildings` - Create building
- `PUT /api/buildings/:id` - Update building

### Energy
- `GET /api/readings` - Get readings
- `POST /api/readings/import` - Import CSV
- `POST /api/readings/simulate` - Generate data

### Anomalies
- `POST /api/anomalies/detect` - Run detection
- `GET /api/anomalies` - List anomalies
- `PUT /api/anomalies/:id/status` - Update status

### SMS
- `POST /api/sms/campaigns` - Send campaign
- `GET /api/sms/campaigns` - List campaigns

[Full API docs in DEPLOYMENT.md](./DEPLOYMENT.md)

---

## 🌐 Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
# Upload dist/ folder
```

### Backend (Railway/Render)
```bash
cd backend
# Set environment variables
npm start
```

### Database (Supabase/Neon)
Use managed PostgreSQL with connection string.

[Complete deployment guide](./DEPLOYMENT.md)

---

## 🎨 Design

- **Color Palette**: Forest green (#15370D) + Warm gold (#E5CD82)
- **Typography**: Inter font family
- **Animations**: Orbital sphere background on landing page
- **Responsive**: Mobile, tablet, desktop layouts
- **Accessibility**: WCAG compliant colors and labels

---

## 📝 License

MIT License - feel free to use for your projects!

---

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push and open a Pull Request

---

## 📞 Support

- **Documentation**: [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Issues**: GitHub Issues
- **Email**: support@savera.ai

---

## 🎯 Roadmap

- [ ] IoT meter integration (MQTT)
- [ ] Water consumption monitoring
- [ ] Waste management module
- [ ] Computer vision waste classification
- [ ] Mobile app (React Native)
- [ ] Advanced ML models (LSTM, Prophet)
- [ ] Multi-campus support
- [ ] White-label solution

---

**Built with ❤️ for sustainable energy management**

*Savera (सवेरा) means "dawn" in Hindi — bringing light to energy intelligence*
