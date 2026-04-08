@echo off
color 0A
title Unilink Dashboard Server

echo ==============================================
echo       Khoi dong Unilink Dashboard
echo ==============================================

cd /d "%~dp0"

if not exist node_modules\ (
    echo.
    echo [1/2] Dang cai dat cac thu vien can thiet...
    npm install
) else (
    echo.
    echo [1/2] Cac thu vien da duoc cai dat san.
)

echo.
echo [2/2] Dang khoi dong server...
echo.
npm run dev

pause
