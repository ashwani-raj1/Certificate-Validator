# Certificate Validator
A full-stack web application to issue and verify student certificates using MongoDB and Ethereum blockchain.

## Features
- Admin login using JWT
- Add certificates manually
- Upload multiple certificates using Excel
- Verify certificate using Certificate ID
- Verify certificate image using OCR
- SHA-256 hash generation
- Ethereum Sepolia blockchain integration
- Prevent duplicate Certificate IDs
- View transaction on Sepolia Etherscan

## Tech Stack
- Frontend: React, Vite, CSS
- Backend: Node.js, Express.js
- Database: MongoDB, Mongoose
- Blockchain: Solidity, Hardhat, Ethereum Sepolia
- Authentication: JWT, bcrypt
- Other Tools: Ethers.js, Multer, XLSX, Tesseract.js

## How It Works
1. Admin logs in and adds certificate details.
2. Backend creates a SHA-256 hash from certificate data.
3. The hash is stored on Ethereum blockchain.
4. Certificate details and transaction hash are saved in MongoDB.
5. During verification, the backend compares the regenerated hash with the blockchain hash.
6. If both hashes match, the certificate is authentic.

## Run Locally

### Backend
cd backend
npm install
node index.js

### Frontend
cd frontend/certification_id
npm install
npm run dev
