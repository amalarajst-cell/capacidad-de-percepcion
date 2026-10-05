@echo off
title Servidor Local Stand - Capacidad de Percepcion
echo ========================================================
echo Iniciando Servidor Local Nativo Windows para el Stand...
echo ========================================================
powershell -ExecutionPolicy Bypass -File "%~dp0server.ps1"
pause
