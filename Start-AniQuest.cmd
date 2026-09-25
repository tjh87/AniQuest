@echo off
setlocal
title AniQuest - Offline
pushd "%~dp0"
if errorlevel 1 goto folder_error
set "ANIQUEST_NODE=node.exe"
if exist "runtime\windows-x64\node.exe" set "ANIQUEST_NODE=%CD%\runtime\windows-x64\node.exe"
"%ANIQUEST_NODE%" "scripts\serve-local.mjs" --check >nul 2>nul
if errorlevel 1 goto missing_node
"%ANIQUEST_NODE%" "scripts\serve-local.mjs" --open
set "ANIQUEST_EXIT=%ERRORLEVEL%"
if not "%ANIQUEST_EXIT%"=="0" pause
popd
exit /b %ANIQUEST_EXIT%
:missing_node
echo Extract the complete Windows offline ZIP. It includes Node.js.
echo For a source checkout, run Prepare-Windows-Runtime.ps1 while connected.
echo Or install Node.js 22.13 or later from https://nodejs.org/.
pause
popd
exit /b 1
:folder_error
echo Extract the complete ZIP to a local folder first.
pause
exit /b 1
