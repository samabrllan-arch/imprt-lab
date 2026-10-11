@echo off
title 3D Shirt Studio - Servidor Local
cls
echo ===================================================
echo       Iniciando 3D Shirt Studio en Localhost
echo ===================================================
echo.
echo Abriendo la tienda en tu navegador...
timeout /t 1 /nobreak >nul
start http://localhost:5173/
echo.
echo Servidor activo en http://localhost:5173/
echo Puedes cerrar esta ventana cuando termines de usar la tienda.
echo.
call npx vite --port 5173
pause
