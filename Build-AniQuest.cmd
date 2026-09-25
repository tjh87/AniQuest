@echo off
setlocal
title AniQuest - Rebuild Offline
pushd "%~dp0"
if errorlevel 1 exit /b 1
if exist "runtime\windows-x64\node.exe" set "PATH=%CD%\runtime\windows-x64;%PATH%"
node.exe "scripts\serve-local.mjs" --check
if errorlevel 1 goto failed
if not exist "node_modules\vite\bin\vite.js" goto missing_dependencies
call npm.cmd run typecheck:local
if errorlevel 1 goto failed
call npm.cmd run build:local
if errorlevel 1 goto failed
call npm.cmd run offline:inventory
if errorlevel 1 goto failed
call npm.cmd run offline:verify
if errorlevel 1 goto failed
echo Build complete. Run Start-AniQuest.cmd.
pause
popd
exit /b 0
:missing_dependencies
echo Run Setup-Development.cmd once while connected on this Windows computer.
echo Keep node_modules and .npm-cache on this computer for offline rebuilds.
:failed
echo Build failed. Read the error above.
pause
popd
exit /b 1
