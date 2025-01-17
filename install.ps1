# Устанавливаем кодировку UTF-8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$PSDefaultParameterValues['*:Encoding'] = 'utf8'

# Проверяем наличие прав администратора
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "❌ Требуются права администратора. Пожалуйста, запустите PowerShell от имени администратора."
    exit 1
}

Write-Host "🚀 Установка RPG (Rapid Package Generator)..."

# Проверяем наличие Node.js
try {
    $nodeVersion = node -v
} catch {
    Write-Host "❌ Node.js не установлен. Пожалуйста, установите Node.js (https://nodejs.org)"
    exit 1
}

# Проверяем наличие npm
try {
    $npmVersion = npm -v
} catch {
    Write-Host "❌ npm не установлен. Пожалуйста, установите npm"
    exit 1
}

# Проверяем версию Node.js
$majorVersion = [int]($nodeVersion -replace 'v(\d+)\..+','$1')
if ($majorVersion -lt 16) {
    Write-Host "❌ Требуется Node.js версии 16 или выше"
    Write-Host "Текущая версия: $nodeVersion"
    exit 1
}

Write-Host "📦 Установка зависимостей..."

# Устанавливаем RPG глобально
try {
    npm install -g @somemedic/rpg
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✨ RPG успешно установлен!"
        Write-Host ""
        Write-Host "Для начала работы выполните:"
        Write-Host "  rpg create react-app my-app    # Создать React приложение"
        Write-Host "  rpg create next-app my-app     # Создать Next.js приложение"
        Write-Host "  rpg create express-api my-app   # Создать Express API"
        Write-Host ""
        Write-Host "Документация: https://github.com/SomeMedic/rpg#readme"
    } else {
        Write-Host "❌ Ошибка при установке RPG"
        exit 1
    }
} catch {
    Write-Host "❌ Ошибка при установке RPG: $_"
    exit 1
} 