@echo off
echo ==========================================
echo Memulai Aplikasi EduBot
echo ==========================================
echo.
echo [STEP 1] Pastikan MongoDB password sudah diatur di backend/.env.local
echo.
echo [STEP 2] Memulai Backend Server
start cmd /k "cd backend && npm run dev"
echo.
echo [STEP 3] Memulai Frontend
echo Tunggu beberapa detik agar backend siap...
timeout /t 5
start cmd /k "npm start"
echo.
echo Aplikasi EduBot telah dijalankan!
echo - Frontend: http://localhost:3000
echo - Backend: http://localhost:5000
echo.
echo Tekan tombol apapun untuk menutup window ini...
pause > nul 