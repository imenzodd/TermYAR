@echo off
chcp 65001 > nul
title TermYar Launcher

echo Opening TermYar in your browser...

if exist "اجرای_مستقیم_ترم‌یار.html" (
    start "" "اجرای_مستقیم_ترم‌یار.html"
    exit /b
)

if exist "TermYar.html" (
    start "" "TermYar.html"
    exit /b
)

if exist "dist\index.html" (
    start "" "dist\index.html"
    exit /b
)

call npm run dev
