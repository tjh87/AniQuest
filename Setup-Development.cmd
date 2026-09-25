@echo off
setlocal
title AniQuest - Prepare Development
pushd "%~dp0"
if errorlevel 1 exit /b 1
if exist "runtime\windows-x64\node.exe" set "PATH=%CD%\runtime\windows-x64;%PATH%"
node.exe "scripts\serve-local.mjs" --check
if errorlevel 1 goto failed
echo This step installs locked development tools and needs internet access.
call npm.cmd ci --cache .npm-cache
if errorlevel 1 goto failed
call npm.cmd test
if errorlevel 1 goto failed
echo Development is ready. Keep node_modules and .npm-cache for offline builds.
pause
popd
exit /b 0
:failed
echo Setup failed. Read the error above.
pause
popd
exit /b 1
