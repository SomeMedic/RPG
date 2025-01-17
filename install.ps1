# Проверяем наличие прав администратора
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "❌ Admin rights required. Please, restart PowerShell as admin"
    exit 1
}

Write-Host "🚀 Installing RPG (Rapid Package Generator)..."

# Проверяем наличие Node.js
try {
    $nodeVersion = node -v
} catch {
    Write-Host "❌ Node.js not installed. Please, install Node.js (https://nodejs.org)"
    exit 1
}

# Проверяем наличие npm
try {
    $npmVersion = npm -v
} catch {
    Write-Host "❌ npm not installed. Please, install npm"
    exit 1
}

# Проверяем версию Node.js
$majorVersion = [int]($nodeVersion -replace 'v(\d+)\..+','$1')
if ($majorVersion -lt 16) {
    Write-Host "❌ Node.js 16 or higher required"
    Write-Host "Current version: $nodeVersion"
    exit 1
}

Write-Host "📦 Installing dependencies..."

# Устанавливаем RPG глобально
try {
    npm install -g @somemedic/rpg
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✨ RPG installed successfully!"
        Write-Host ""
        Write-Host "To start working, run:"
        Write-Host "  rpg create react-app my-app    # Create React app"
        Write-Host "  rpg create next-app my-app     # Create Next.js app"
        Write-Host "  rpg create express-api my-app   # Create Express API"
        Write-Host ""
        Write-Host "Documentation: https://github.com/SomeMedic/rpg#readme"
    } else {
        Write-Host "❌ Error installing RPG"
        exit 1
    }
} catch {
    Write-Host "❌ Error installing RPG: $_"
    exit 1
} 