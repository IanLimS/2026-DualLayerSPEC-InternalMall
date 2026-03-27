@echo off
chcp 65001 >nul
title qi dong yu lan

echo [qi dongInternal Employee Benefits Mall]
echo.

:: ting zhi yi you fu wu
for /f "tokens=5" %%a in ('netstat -ano 2^>nul ^| findstr ":3001 :5173"') do (
    taskkill /F /PID %%a >nul 2>&1
)

:: qi dongBackend
echo qi dongBackendfu wu...
cd /d "%~dp0backend"
start "Backendfu wu" cmd /k "npm run dev"

timeout /t 3 /nobreak >nul

:: qi dongFrontend
echo qi dongFrontendfu wu...
cd /d "%~dp0frontend"
start "Frontendfu wu" cmd /k "npm run dev"

timeout /t 3 /nobreak >nul

echo.
echo fu wu yi qi dong:
echo   Backend: http://localhost:3001
echo   Frontend: http://localhost:5173
echo.
echo Testzhang hao:
echo   pu tongUser: user1/password1
echo   Admin: admin/admin123
echo.

start http://localhost:5173

echo an ren yi jian tui chu（fu wu jiang ji xu yun xing）
pause >nul
