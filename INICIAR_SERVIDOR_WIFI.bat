@echo off
title Servidor Local Stand - Capacidad de Percepcion
echo ========================================================
echo Iniciando Servidor Local del Stand (con sincronizacion)...
echo ========================================================
where node >nul 2>nul
if %errorlevel%==0 (
  node "%~dp0server.js"
) else (
  echo [AVISO] Node.js no esta instalado: se usa el servidor basico SIN sincronizacion
  echo         entre dispositivos. Instala Node.js desde https://nodejs.org para sincronizar.
  powershell -ExecutionPolicy Bypass -File "%~dp0server.ps1"
)
pause
