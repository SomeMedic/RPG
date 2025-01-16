import chalk from 'chalk';
import inquirer from 'inquirer';
import { join } from 'path';
import { writeFile, existsSync } from 'fs';
import { promisify } from 'util';
const writeFileAsync = promisify(writeFile);
const plugin = {
    name: 'rpg-plugin-init',
    version: '1.0.0',
    description: 'Инициализация нового проекта',
    hooks: {},
    async init(context) {
        const program = context.program;
        if (!program)
            return;
        program
            .command('init')
            .description('Создать новый package.json')
            .option('-y, --yes', 'Пропустить все вопросы и использовать значения по умолчанию')
            .action(async (options) => {
            const packageJsonPath = join(process.cwd(), 'package.json');
            if (existsSync(packageJsonPath) && !options.force) {
                const { overwrite } = await inquirer.prompt([
                    {
                        type: 'confirm',
                        name: 'overwrite',
                        message: 'package.json уже существует. Перезаписать?',
                        default: false
                    }
                ]);
                if (!overwrite) {
                    console.log(chalk.yellow('Операция отменена'));
                    return;
                }
            }
            let packageJson;
            if (options.yes) {
                // Используем значения по умолчанию
                const dirName = process.cwd().split(/[\\/]/).pop() || 'my-project';
                packageJson = {
                    name: dirName,
                    version: '1.0.0',
                    description: '',
                    main: 'index.js',
                    scripts: {
                        test: 'echo "Error: no test specified" && exit 1'
                    },
                    keywords: [],
                    author: '',
                    license: 'ISC',
                    dependencies: {},
                    devDependencies: {}
                };
            }
            else {
                // Интерактивный режим
                const answers = await inquirer.prompt([
                    {
                        type: 'input',
                        name: 'name',
                        message: 'Название пакета:',
                        default: process.cwd().split(/[\\/]/).pop(),
                        validate: (input) => {
                            if (/^[a-zA-Z0-9-_]+$/.test(input))
                                return true;
                            return 'Название может содержать только буквы, цифры, дефис и подчеркивание';
                        }
                    },
                    {
                        type: 'input',
                        name: 'version',
                        message: 'Версия:',
                        default: '1.0.0',
                        validate: (input) => {
                            if (/^\d+\.\d+\.\d+(-[a-zA-Z0-9.]+)?$/.test(input))
                                return true;
                            return 'Версия должна быть в формате semver (например, 1.0.0)';
                        }
                    },
                    {
                        type: 'input',
                        name: 'description',
                        message: 'Описание:'
                    },
                    {
                        type: 'input',
                        name: 'main',
                        message: 'Точка входа:',
                        default: 'index.js'
                    },
                    {
                        type: 'confirm',
                        name: 'isModule',
                        message: 'Использовать ES модули?',
                        default: false
                    },
                    {
                        type: 'input',
                        name: 'keywords',
                        message: 'Ключевые слова (через запятую):'
                    },
                    {
                        type: 'input',
                        name: 'author',
                        message: 'Автор:'
                    },
                    {
                        type: 'list',
                        name: 'license',
                        message: 'Лицензия:',
                        choices: ['ISC', 'MIT', 'Apache-2.0', 'GPL-3.0', 'Другая'],
                        default: 'ISC'
                    }
                ]);
                packageJson = {
                    name: answers.name,
                    version: answers.version,
                    description: answers.description,
                    main: answers.main,
                    ...(answers.isModule && { type: 'module' }),
                    scripts: {
                        test: 'echo "Error: no test specified" && exit 1'
                    },
                    keywords: answers.keywords.split(',').map((keyword) => keyword.trim()).filter(Boolean),
                    author: answers.author,
                    license: answers.license,
                    dependencies: {},
                    devDependencies: {}
                };
            }
            try {
                await writeFileAsync(packageJsonPath, JSON.stringify(packageJson, null, 2));
                console.log(chalk.green('✨ package.json успешно создан'));
                if (!options.yes) {
                    console.log(chalk.blue('\nДля установки зависимостей используйте:'));
                    console.log(chalk.yellow('  rpg install\n'));
                }
            }
            catch (error) {
                console.error(chalk.red(`❌ Ошибка: ${error.message}`));
                process.exit(1);
            }
        });
    }
};
export default plugin;
