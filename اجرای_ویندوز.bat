@echo off
chcp 65001 > nul
title TermYar Launcher - ترم‌یار

echo ========================================================
echo        سامانه ترم‌یار (TermYar) - دستیار دانشگاهی
echo ========================================================
echo.
echo در حال باز کردن برنامه در مرورگر شما...
echo.

if exist "اجرای_مستقیم_ترم‌یار.html" (
    start "" "اجرای_مستقیم_ترم‌یار.html"
    echo برنامه باز شد!
    timeout /t 3 > nul
    exit /b
)

if exist "TermYar.html" (
    start "" "TermYar.html"
    echo برنامه باز شد!
    timeout /t 3 > nul
    exit /b
)

if exist "dist\index.html" (
    start "" "dist\index.html"
    echo برنامه باز شد!
    timeout /t 3 > nul
    exit /b
)

echo فایل آماده پیدا نشد. در حال تلاش برای اجرای سرور محلی...
call npm run dev
