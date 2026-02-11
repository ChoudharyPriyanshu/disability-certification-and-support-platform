# Blockchain-Enabled Disability Certificate & Assistive Support Platform

A production-grade, institutional civic-tech platform for disability certification with blockchain-verified credentials.

## 🏗️ Architecture

This project follows a **strict three-tier architecture** with complete separation of concerns:

```
MajorProject-1/
├── blockchain/    # Solidity + Hardhat (Independent)
├── backend/       # Node.js + Express + MongoDB (Independent)
└── frontend/      # React + Vite + Tailwind v4 (Independent)
```

### Key Design Principles

- **Institutional Design**: Calm, authoritative aesthetic—not SaaS or Web3 startup
- **Blockchain as Trust Anchor**: Only certificate hashes on-chain, no business logic
- **Accessibility First**: WCAG AA compliant, keyboard navigation, screen reader support
- **Role-Based Workflow**: PWD_USER → ADMIN → DOCTOR strict workflow enforcement
- **Security**: JWT auth, server-side validation, no sensitive data on blockchain

---

## 🔐 Blockchain Layer

### Technology Stack
- Solidity 0.8.19
- Hardhat
- Ethers.js

### Smart Contract: `CertificateRegistry.sol`

**Purpose**: Immutable storage and verification of certificate hashes ONLY.

**Functions**:
- `storeCertificateHash(bytes32 hash)` - Owner-only
- `verifyCertificateHash(bytes32 hash)` - Public
- `getCertificateTimestamp(bytes32 hash)` - Public

### Setup & Deployment

```bash
cd blockchain

# Install dependencies
npm install

# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test

# Start local blockchain node (in separate terminal)
npx hardhat node

# Deploy contract to local network
npm run deploy
```

**Important**: After deployment, the contract address will be saved in `blockchain/deployment.json` and the ABI will be automatically copied to `backend/contracts/`.

---

## 🔧 Backend Layer

### Technology Stack
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Ethers.js (blockchain integration)
- Multer (file uploads)

### Data Models
1. **User** - Role-based (PWD_USER, ADMIN, DOCTOR)
2. **Application** - Full workflow tracking
3. **Certificate** - With blockchain references
4. **GovernmentScheme** - Welfare schemes
5. **AssistiveEquipment** - Equipment marketplace

### Application Workflow
```
SUBMITTED → VERIFIED → DOCTOR_ASSIGNED → ASSESSED → APPROVED → CERTIFICATE_ISSUED
```

### Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your configuration:
# - MongoDB URI
# - JWT secret
# - Blockchain contract address (from blockchain/deployment.json)
# - Private key for blockchain transactions

# Start MongoDB (if local)
# mongod

# Start server
npm run dev
```

### Environment Variables

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/disability-certificate-db
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRE=7d
BLOCKCHAIN_NETWORK=http://127.0.0.1:8545
CONTRACT_ADDRESS=<from deployment.json>
PRIVATE_KEY=<from hardhat node accounts>
FRONTEND_URL=http://localhost:5173
```

**Getting the Private Key**:
When you run `npx hardhat node`, it will display test accounts with private keys. Use one of these for development.

### API Endpoints

#### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Get profile (protected)

#### Applications
- `POST /api/applications` - Submit application (PWD_USER)
- `GET /api/applications` - Get applications (role-filtered)
- `GET /api/applications/:id` - Get single application
- `PATCH /api/applications/:id/status` - Update status (ADMIN)
- `PATCH /api/applications/:id/assign-doctor` - Assign doctor (ADMIN)
- `PATCH /api/applications/:id/assessment` - Submit assessment (DOCTOR)

#### Certificates
- `POST /api/certificates/issue` - Issue certificate (ADMIN)
- `GET /api/certificates/verify` - Verify certificate (PUBLIC)
- `GET /api/certificates/my-certificates` - User's certificates

#### Schemes & Equipment
- `GET /api/schemes` - Get welfare schemes
- `GET /api/equipment` - Get assistive equipment

---

## 🎨 Frontend Layer

### Technology Stack
- React 18
- React Router v6
- Tailwind CSS v4 (with `@tailwindcss/vite` plugin)
- Axios
- React Hook Form (for forms)
- QRCode.react (for certificate QR codes)

### Design System

**Color Palette**:
- Base: Deep charcoal (#0A0E14)
- Accent: Muted blue (#4A90E2) - trust & authority
- No crypto gradients, no SaaS flashiness

**Typography**:
- Headings: Source Serif 4 (editorial, humanist)
- Body: Public Sans (clarity, legibility)
- Code: JetBrains Mono

**Accessibility**:
- WCAG AA contrast ratios
- Keyboard navigation
- Screen reader support
- Reduced motion support

### Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will run on `http://localhost:5173` with API proxy to `http://localhost:5000`.

### User Roles & Pages

#### PWD_USER (Person with Disability)
- `/dashboard` - View applications
- `/apply` - Submit new application
- `/application/:id` - Track application status
- `/certificate` - View issued certificate
- `/schemes` - Browse welfare schemes
- `/equipment` - Browse assistive equipment

#### ADMIN
- `/admin` - Application queue
- `/admin/application/:id` - Review, assign doctor, approve

#### DOCTOR
- `/doctor` - Assigned cases
- `/doctor/case/:id` - Submit medical assessment

#### PUBLIC
- `/verify` - Verify certificate on blockchain
- `/` - Home page

---

## 🚀 Complete Setup Guide

### Prerequisites
- Node.js v18+
- MongoDB v6+
- npm or yarn

### Step 1: Clone & Navigate
```bash
cd d:\PROJECTS\MajorProject-1
```

### Step 2: Blockchain Setup
```bash
# Terminal 1: Start Hardhat node
cd blockchain
npm install
npx hardhat node

# Terminal 2: Deploy contract
cd blockchain
npm run deploy
# Note the contract address from deployment.json
```

### Step 3: Backend Setup
```bash
cd backend
npm install
cp .env.example .env

# Edit .env file:
# - Set CONTRACT_ADDRESS from blockchain/deployment.json
# - Set PRIVATE_KEY from hardhat node output
# - Configure MongoDB URI

# Start server
npm run dev
```

### Step 4: Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Step 5: Access Application
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`
- Blockchain: `http://localhost:8545`

---

## 👥 Creating Test Users

### Register Users via API or Frontend

**Admin User** (create manually via MongoDB or registration):
```json
{
  "email": "admin@example.com",
  "password": "admin123",
  "role": "ADMIN",
  "profile": {
    "firstName": "Admin",
    "lastName": "User",
    "phone": "1234567890"
  }
}
```

**Doctor**:
```json
{
  "email": "doctor@example.com",
  "password": "doctor123",
  "role": "DOCTOR",
  "profile": {
    "firstName": "Dr. Jane",
    "lastName": "Smith",
    "phone": "1234567890",
    "medicalLicenseNumber": "MED12345",
    "specialization": "Orthopedics",
    "hospital": "City Hospital"
  }
}
```

**PWD User**:
```json
{
  "email": "user@example.com",
  "password": "user123",
  "role": "PWD_USER",
  "profile": {
    "firstName": "John",
    "lastName": "Doe",
    "phone": "1234567890",
    "dateOfBirth": "1990-01-01"
  }
}
```

---

## 🔄 Complete Application Workflow

1. **PWD User**: Register → Login → Submit Application
2. **Admin**: Login → Review → Verify → Assign Doctor
3. **Doctor**: Login → View Case → Submit Assessment
4. **Admin**: Approve Application → Issue Certificate (triggers blockchain)
5. **PWD User**: Download Certificate (with QR code)
6. **Public**: Verify Certificate on blockchain

---

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test
```

### Blockchain Tests
```bash
cd blockchain
npx hardhat test
```

---

## 📁 Project Structure Details

### Backend Structure
```
backend/
├── controllers/     # Request handlers
├── models/          # MongoDB schemas
├── routes/          # API routes
├── middleware/      # Auth, upload middleware
├── services/        # Blockchain, hash services
└── server.js        # Express app
```

### Frontend Structure
```
frontend/src/
├── components/      # Reusable UI components
├── pages/           # Route pages (user, admin, doctor)
├── context/         # React context (Auth)
├── utils/           # API client, helpers
└── index.css        # Design system
```

---

## 🔒 Security Considerations

1. **No Personal Data on Blockchain**: Only certificate hashes
2. **JWT Expiration**: Tokens expire after 7 days
3. **Role-Based Access**: Strict middleware enforcement
4. **Input Validation**: Server-side validation for all inputs
5. **File Upload Security**: Type and size restrictions
6. **Password Hashing**: bcrypt with salt rounds

---

## 🎯 Key Features

✅ Blockchain-verified certificates (immutable)  
✅ Role-based authentication (PWD_USER, ADMIN, DOCTOR)  
✅ Server-enforced workflow (6-stage application process)  
✅ Document upload & management  
✅ QR code generation for certificates  
✅ Public certificate verification  
✅ Government welfare schemes directory  
✅ Assistive equipment marketplace  
✅ WCAG AA accessible UI  
✅ Mobile-responsive design  

---

## 📝 Next Steps (Future Enhancements)

- Complete remaining frontend pages (application form, timeline view)
- Implement PDF certificate generation
- Add email notifications
- Deploy to production (Ethereum mainnet/testnet for blockchain)
- Add comprehensive test coverage
- Implement admin CRUD for schemes/equipment

---

## 📄 License

MIT

---

## 👤 Author

Built as an academic/civic-tech demonstration project.

**Design Philosophy**: Institutional trust, accessibility, and human dignity—not hype.
