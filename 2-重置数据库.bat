@echo off
chcp 65001 >nul
title zhong zhiDatabase

echo [zhong zhiDatabase]
echo.

cd /d "%~dp0backend"

node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: wei jian ce daoNode.js，qing xian an zhuang
    pause
    exit /b 1
)

echo zheng zai zhong zhi...
node init-db.js

if %errorlevel% equ 0 (
    echo.
    echo Databasezhong zhiSucceeded！
) else (
    echo.
    echo Databasezhong zhiFailed！
)

pause
