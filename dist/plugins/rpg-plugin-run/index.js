import chalk from 'chalk';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { spawn } from 'child_process';
import inquirer from 'inquirer';
import { platform } from 'os';
const isWindows = platform() === 'win32';
// Парсим команду в массив аргументов
function parseCommand(command) {
    const args = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < command.length; i++) {
        const char = command[i];
        if (char === '"' || char === "'") {
            inQuotes = !inQuotes;
            continue;
        }
        if (char === ' ' && !inQuotes) {
            if (current) {
                args.push(current);
                current = '';
            }
        }
        else {
            current += char;
        }
    }
    if (current) {
        args.push(current);
    }
    return args;
}
const plugin = {
    name: 'rpg-plugin-run',
    version: '1.0.0',
    description: 'Запуск скриптов',
    hooks: {},
    async init(context) {
        if (!context.program)
            return;
        context.program
            .command('run [script]')
            .description('Запустить скрипт из package.json')
            .option('-l, --list', 'Показать список доступных скриптов')
            .action(async (script, options) => {
            try {
                const packageJsonPath = join(process.cwd(), 'package.json');
                const content = await readFile(packageJsonPath, 'utf-8');
                const packageJson = JSON.parse(content);
                const scripts = packageJson.scripts || {};
                // Если нет скриптов, выводим сообщение
                if (Object.keys(scripts).length === 0) {
                    console.log(chalk.yellow('В package.json нет скриптов'));
                    return;
                }
                // Показываем список скриптов
                if (options.list || !script) {
                    console.log(chalk.hex('#544F3D').bold('\nДоступные скрипты:'));
                    for (const [name, cmd] of Object.entries(scripts)) {
                        console.log(`  ${chalk.hex('#4B5320')(name)}\t${chalk.hex('#515744')(cmd)}`);
                    }
                    return;
                }
                // Проверяем существование скрипта
                if (!script || !scripts[script]) {
                    // Если скрипт не найден, предлагаем похожие
                    const similarScripts = Object.keys(scripts).filter(name => script ? (name.includes(script) || script.includes(name)) : false);
                    if (similarScripts.length > 0) {
                        console.log(chalk.yellow(`\nСкрипт "${script || ''}" не найден. Возможно, вы имели в виду:`));
                        for (const name of similarScripts) {
                            console.log(`  ${chalk.hex('#4B5320')(name)}\t${chalk.hex('#515744')(scripts[name])}`);
                        }
                    }
                    else {
                        // Если похожих скриптов нет, предлагаем выбрать из списка
                        const { selectedScript } = await inquirer.prompt([
                            {
                                type: 'list',
                                name: 'selectedScript',
                                message: 'Выберите скрипт для запуска:',
                                choices: Object.keys(scripts).map(name => ({
                                    name: `${name}\t${scripts[name]}`,
                                    value: name
                                }))
                            }
                        ]);
                        script = selectedScript;
                    }
                }
                if (!script) {
                    return;
                }
                // Получаем команду из скрипта
                const command = scripts[script];
                console.log(chalk.hex('#4B5320')(`\n> ${command}\n`));
                // Парсим команду в массив аргументов
                const [cmd, ...args] = parseCommand(command);
                // Определяем правильную команду для Windows
                const execCmd = isWindows && cmd === 'node' ? 'node.exe' : cmd;
                // Если запускаем node, добавляем аргументы для предотвращения вывода справки
                const finalArgs = cmd === 'node' || cmd === 'node.exe'
                    ? [...args, '--', 'start']
                    : args;
                // Запускаем команду напрямую
                const child = spawn(execCmd, finalArgs, {
                    stdio: 'inherit',
                    shell: true,
                    env: { ...process.env, RPG_CHILD: '1' }
                });
                child.on('error', (error) => {
                    console.error(chalk.red(`❌ Ошибка запуска скрипта: ${error.message}`));
                });
                child.on('exit', (code) => {
                    if (code !== 0) {
                        console.error(chalk.red(`❌ Скрипт завершился с ошибкой (код ${code})`));
                    }
                });
            }
            catch (error) {
                console.error(chalk.red(`❌ Ошибка: ${error.message}`));
            }
        });
    }
};
export default plugin;
