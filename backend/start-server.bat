@echo off
echo =======================================
echo STARTING EDUBOT BACKEND SERVER
echo =======================================

:: Cek apakah node.js dan npm tersedia
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
  echo ERROR: Node.js not found! Please install Node.js first.
  pause
  exit /b 1
)

:: Install dependencies jika belum ada
if not exist "node_modules" (
  echo Installing dependencies...
  call npm install
)

:: Start server
echo Starting backend server on port 5000...
call npm run dev

pause 