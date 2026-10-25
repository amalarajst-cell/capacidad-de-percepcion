@echo off
title Capacidad de Percepcion - Stand F1
where node >nul 2>nul
if %errorlevel%==0 (
  echo Iniciando servidor local y abriendo la app...
  start "Servidor Stand" /min cmd /c node "%~dp0server.js"
  timeout /t 2 /nobreak >nul
  start "" "http://localhost:3000"
  echo.
  echo Admin: http://localhost:3000/admin.html
  echo Deja la ventana "Servidor Stand" abierta mientras uses la app.
  timeout /t 5 >nul
) else (
  echo [AVISO] Node.js no esta instalado: la app se abre SIN sincronizacion con el admin.
  start "" "%~dp0index.html"
  pause
)
exit
