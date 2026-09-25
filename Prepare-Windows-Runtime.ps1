$ErrorActionPreference = 'Stop'
$version = '22.23.3'
$expected = '2b0ff57b049cda1bbcea2240eec20467018713c1efe1f7360c2681859b90ed71'
if (-not [Environment]::Is64BitOperatingSystem) { throw 'This package requires 64-bit Windows.' }
$temporary = Join-Path ([IO.Path]::GetTempPath()) ('aniquest-node-' + [guid]::NewGuid())
$runtime = Join-Path $PSScriptRoot 'runtime\windows-x64'
if (Test-Path $runtime) { throw 'The runtime folder already exists. Keep it, or move it before preparing another copy.' }
New-Item -ItemType Directory -Path $temporary -Force | Out-Null
try {
    $archive = Join-Path $temporary 'node.zip'
    [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
    Invoke-WebRequest -UseBasicParsing -Uri "https://nodejs.org/dist/v$version/node-v$version-win-x64.zip" -OutFile $archive
    if ((Get-FileHash -Algorithm SHA256 $archive).Hash.ToLowerInvariant() -ne $expected) { throw 'Node.js checksum mismatch. Nothing was installed.' }
    Expand-Archive -LiteralPath $archive -DestinationPath $temporary
    New-Item -ItemType Directory -Path (Split-Path $runtime) -Force | Out-Null
    Move-Item -LiteralPath (Join-Path $temporary "node-v$version-win-x64") -Destination $runtime
    & (Join-Path $runtime 'node.exe') --version
    if ($LASTEXITCODE -ne 0) { throw 'The Windows runtime could not start.' }
    Write-Host 'Runtime ready. Open Start-AniQuest.cmd.'
} finally { Remove-Item -LiteralPath $temporary -Recurse -Force }
