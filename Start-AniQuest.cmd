@echo off
setlocal
title AniQuest - Local
pushd "%~dp0"
if errorlevel 1 goto folder_error
where node.exe >nul 2>nul
if errorlevel 1 goto missing_node
node.exe "scripts\serve-local.mjs" --open
set "ANIQUEST_EXIT=%ERRORLEVEL%"
if not "%ANIQUEST_EXIT%"=="0" pause
popd
exit /b %ANIQUEST_EXIT%

:missing_node
echo Install Node.js 22 LTS for Windows, then open this file again.
echo Choose the x64 installer for a standard 64-bit Windows 10 PC.
echo https://nodejs.org/download/release/latest-v22.x/
echo.
pause
popd
exit /b 1

:folder_error
echo Extract the complete AniQuest ZIP to a folder on this PC first.
pause
exit /b 1
