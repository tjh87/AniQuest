$ErrorActionPreference = 'Stop'
$node = Join-Path $PSScriptRoot 'runtime\windows-x64\node.exe'
if (-not (Test-Path $node)) { throw 'Prepare the runtime first. Read WINDOWS_SETUP.md.' }
& $node (Join-Path $PSScriptRoot 'scripts\verify-offline.mjs')
if ($LASTEXITCODE -ne 0) { throw 'Offline checks failed.' }
& $node (Join-Path $PSScriptRoot 'scripts\package-offline.mjs')
if ($LASTEXITCODE -ne 0) { throw 'Packaging failed.' }
$output = Join-Path $PSScriptRoot 'releases'
New-Item -ItemType Directory -Path $output -Force | Out-Null
$zip = Join-Path $output ('AniQuest-Windows-Offline-' + (Get-Date -Format 'yyyyMMdd-HHmmss') + '.zip')
Add-Type -AssemblyName System.IO.Compression.FileSystem
[System.IO.Compression.ZipFile]::CreateFromDirectory((Join-Path $PSScriptRoot 'portable-stage'), $zip, [System.IO.Compression.CompressionLevel]::Optimal, $false)
Get-FileHash -Algorithm SHA256 $zip
Write-Host $zip
