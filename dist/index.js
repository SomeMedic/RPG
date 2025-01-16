#!/usr/bin/env node
import { Command } from 'commander';
import { PluginManager } from './core/plugins/PluginManager.js';
import { PackageManager } from './core/PackageManager.js';
import { DependencyResolver } from './core/DependencyResolver.js';
import { PackageInstaller } from './core/PackageInstaller.js';
async function main() {
    // Создаем CLI программу
    const program = new Command();
    program
        .name('rpg')
        .description('RPG Package Manager')
        .version('1.0.0');
    // Инициализируем менеджеры
    const packageManager = new PackageManager(process.cwd());
    const dependencyResolver = new DependencyResolver(packageManager);
    const installer = new PackageInstaller(packageManager, dependencyResolver);
    // Инициализируем менеджер плагинов
    const pluginManager = new PluginManager(program);
    // Загружаем и инициализируем плагины
    await pluginManager.loadPlugins();
    await pluginManager.initializePlugins({
        program,
        packageManager,
        dependencyResolver,
        installer
    });
    // Делаем программу доступной глобально для плагинов
    global.rpgProgram = program;
    // Получаем аргументы после '--'
    const args = process.argv.indexOf('--') > -1
        ? process.argv.slice(process.argv.indexOf('--') + 1)
        : process.argv.slice(2);
    // Если указана команда start, запускаем приложение
    if (args[0] === 'start') {
        // Здесь можно добавить логику запуска приложения
        console.log('Приложение запущено');
        process.exit(0);
    }
    // Иначе обрабатываем команды через Commander
    program.parse(process.argv);
}
main().catch(error => {
    console.error('Критическая ошибка:', error);
    process.exit(1);
});
