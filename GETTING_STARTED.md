# Getting Started Guide

## 🚀 Quick Start

This guide will help you set up and run the **Blockchain-Enabled Disability Certificate Platform** on your local machine.

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v6 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **Git** - [Download](https://git-scm.com/)
- **Code Editor** (VS Code recommended)

---

## 📁 Project Structure

```
MajorProject-1/
├── blockchain/          # Hardhat + Solidity smart contracts
├── backend/            # Node.js + Express + MongoDB API
├── frontend/           # React + Vite + Tailwind CSS
└── README.md
```

---

## ⚙️ Installation

### 1. Start MongoDB

Ensure MongoDB is running on your system:

**Windows:**
```powershell
# Start MongoDB service
net start MongoDB
```

**Mac/Linux:**
```bash
sudo systemctl start mongod
# or
brew services start mongodb-community
```

Verify MongoDB is running:
```bash
mongosh
# Should connect successfully
```

---

### 2. Set Up Blockchain Layer

```powershell
cd blockchain
npm install
```

**Start Local Blockchain:**
```powershell
npx hardhat node
```

**In a new terminal, deploy the contract:**
```powershell
cd blockchain
npx hardhat run scripts/deploy.js --network localhost
```

> **Note:** Copy the deployed contract address - you'll need it for the backend.

---

### 3. Set Up Backend

```powershell
cd backend
npm install
```

**Configure Environment Variables:**

Create a `.env` file in the `backend/` directory:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/disability-certificate

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# Blockchain
BLOCKCHAIN_NETWORK=localhost
CONTRACT_ADDRESS=<paste-deployed-contract-address>
PRIVATE_KEY=<hardhat-account-private-key>

# Frontend
FRONTEND_URL=http://localhost:5173
```

> **Get Private Key from Hardhat:**  
> When you ran `npx hardhat node`, it displayed test accounts with private keys. Copy one of them.

**Start Backend Server:**
```powershell
npm run dev
```

Backend should start at: `http://localhost:5000`

---

### 4. Set Up Frontend

```powershell
cd frontend
npm install
```

**Configure Environment (Optional):**

Create `.env` in the `frontend/` directory:

```env
VITE_API_URL=http://localhost:5000
```

**Start Frontend:**
```powershell
npm run dev
```

Frontend should start at: `http://localhost:5173`

---

## ✅ Verify Installation

### Test Backend Health
```powershell
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "OK",
  "timestamp": "2026-02-12T...",
  "database": "Connected"
}
```

### Test Frontend
Open browser: `http://localhost:5173`

You should see the home page with "Disability Certificate Platform" branding.

---

## 👤 Create Your First User

### 1. Register a User

Navigate to: `http://localhost:5173/register`

Fill in the form:
- Email: `test@example.com`
- Password: `Test123!`
- Role: Select `PWD_USER`
- Name, Phone, etc.

### 2. Login

Navigate to: `http://localhost:5173/login`
- Email: `test@example.com`
- Password: `Test123!`

---

## 🔐 Test Aadhaar OTP Verification

### Option 1: Via Frontend (Once implemented)
Navigate to Aadhaar verification page.

### Option 2: Via API (Manual Testing)

**Request OTP:**
```powershell
curl -X POST http://localhost:5000/api/aadhaar/request-otp `
  -H "Authorization: Bearer <your-jwt-token>" `
  -H "Content-Type: application/json" `
  -d '{"aadhaarNumber": "123456789012"}'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "aadhaarLastFour": "9012",
    "expiresIn": 300,
    "devOTP": 123456  // In development mode
  }
}
```

**Verify OTP:**
```powershell
curl -X POST http://localhost:5000/api/aadhaar/verify-otp `
  -H "Authorization: Bearer <your-jwt-token>" `
  -H "Content-Type: application/json" `
  -d '{"aadhaarNumber": "123456789012", "otp": "123456"}'
```

---

## 📝 Submit a Test Application

1. Ensure you're logged in as `PWD_USER`
2. Ensure Aadhaar is verified (see above)
3. Navigate to application form
4. Fill in disability details
5. Submit application

---

## 👨‍💼 Admin & Doctor Accounts

To test the full workflow, create Admin and Doctor accounts:

**Create Admin (via MongoDB):**
```javascript
use disability-certificate

db.users.updateOne(
  { email: "test@example.com" },
  { $set: { role: "ADMIN" } }
)
```

Or register a new user and manually update the role.

---

## 🔄 Complete Workflow Test

1. **PWD User:** Submit application
2. **Admin:** Review and assign doctor
3. **Doctor:** Assess and submit assessment
4. **Admin:** Approve application
5. **Admin:** Issue certificate → PDF generated
6. **PWD User:** Download certificate
7. **Public:** Verify certificate on blockchain

---

## 🛠️ Development Tips

### Hot Reload

All three layers support hot reload:
- **Blockchain:** Contract changes require re-deployment
- **Backend:** `nodemon` watches for changes
- **Frontend:** Vite HMR

### Database GUI

Use **MongoDB Compass** to view data:
```
mongodb://localhost:27017/disability-certificate
```

### API Testing

Use **Postman** or **Thunder Client** (VS Code extension) to test API endpoints.

Import endpoints from: `/backend/routes/`

---

## 📚 Key API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login

### Aadhaar
- `POST /api/aadhaar/request-otp` - Request OTP
- `POST /api/aadhaar/verify-otp` - Verify OTP
- `GET /api/aadhaar/status` - Check verification status

### Applications
- `POST /api/applications` - Submit application (requires Aadhaar)
- `GET /api/applications` - Get applications
- `PATCH /api/applications/:id/status` - Update status (ADMIN)

### Certificates
- `POST /api/certificates/issue` - Issue certificate (ADMIN)
- `GET /api/certificates/:id/download` - Download PDF
- `GET /api/certificates/verify` - Public verification

---

## 🚨 Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED
```
**Solution:** Ensure MongoDB is running
```powershell
net start MongoDB
```

### Port Already in Use
```
Error: Port 5000 is already in use
```
**Solution:** Kill the process or change port in `.env`

### Blockchain Connection Failed
```
Error: could not detect network
```
**Solution:** Ensure `npx hardhat node` is running

### Rate Limit Exceeded
**Solution:** Wait or restart backend (clears in-memory limits)

---

## 📖 Next Steps

1. ✅ Set up all three layers
2. ✅ Create test accounts
3. ✅ Test Aadhaar OTP flow
4. [ ] Implement frontend Aadhaar OTP UI
5. [ ] Build multi-step application form
6. [ ] Complete Admin dashboard
7. [ ] Complete Doctor dashboard
8. [ ] Add email notifications
9. [ ] Deploy to production

---

## 📞 Need Help?

- **Documentation:** See `README.md` for detailed architecture
- **Security Audit:** See `security_audit.md`
- **API Guide:** See `security_features_guide.md`

---

## 🎯 Current Status

✅ **Backend:** 95% Complete (Production-ready security)  
🚧 **Frontend:** 60% Complete (Core pages done, dashboards in progress)  
✅ **Blockchain:** 100% Complete  

**You're ready to start development!** 🚀
