@echo off
echo Installing frontend dependencies...
npm install axios

echo.
echo Installing backend dependencies...
cd backend
npm init -y
npm install express mongoose bcryptjs jsonwebtoken cors dotenv
npm install nodemon --save-dev
cd ..

echo.
echo Dependencies installed successfully!
echo To start the backend server, run: cd backend && npm run dev
echo To start the frontend, run: npm start 