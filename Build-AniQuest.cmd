@echo off
setlocal
title AniQuest - Build Local App
pushd "%~dp0"
if errorlevel 1 goto folder_error
where node.exe >nul 2>nul
if errorlevel 1 goto missing_node
node.exe "scripts\serve-local.mjs" --check
if errorlevel 1 goto failed
where npm.cmd >nul 2>nul
if errorlevel 1 goto missing_node
echo Installing the locked project dependencies. Internet access is needed.
call npm.cmd ci
if errorlevel 1 goto failed
call npm.cmd run build:local
if errorlevel 1 goto failed
echo.
echo Build complete. Open Start-AniQuest.cmd to use the updated app.
pause
popd
exit /b 0

:missing_node
echo Install Node.js 22 LTS for Windows with npm included, then try again.
echo https://nodejs.org/download/release/latest-v22.x/
:failed
echo.
echo The build did not finish. Read the error above before you close this window.
pause
popd
exit /b 1

:folder_error
echo Extract the complete AniQuest ZIP to a folder on this PC first.
pause
exit /b 1
