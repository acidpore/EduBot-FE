@echo off
echo ==========================================
echo EduBot - Setup Dependencies
echo ==========================================
echo.

REM Frontend dependencies
echo [1/3] Installing frontend dependencies...
call npm install axios react-icons react-router-dom
if %errorlevel% neq 0 (
    echo Error: Failed to install frontend dependencies.
    pause
    exit /b 1
)

echo.
REM Backend dependencies
echo [2/3] Installing backend dependencies...
cd backend
call npm init -y
call npm install express mongoose bcryptjs jsonwebtoken cors dotenv axios
call npm install nodemon --save-dev
if %errorlevel% neq 0 (
    echo Error: Failed to install backend dependencies.
    cd ..
    pause
    exit /b 1
)
cd ..

echo.
echo [3/3] Setup completed successfully!
echo ==========================================
echo.
echo To start the application:
echo - Backend server: cd backend && npm run dev
echo - Frontend: npm start
echo.
echo Alternatively, use start-app.bat to run both at once.
echo ==========================================
pause 