import chalk from 'chalk';
import inquirer from 'inquirer';
import { createSpinner } from 'nanospinner';
const plugin = {
    name: 'rpg-plugin-uninstall',
    version: '1.0.0',
    description: 'Удаление пакетов',
    hooks: {},
    async init(context) {
        if (!context.program)
            return;
        context.program
            .command('uninstall [packages...]')
            .alias('remove')
            .description('Удалить пакеты')
            .option('-y, --yes', 'Пропустить подтверждение')
            .action(async (packages, options) => {
            if (!context.packageManager) {
                console.error(chalk.red('PackageManager не инициализирован'));
                return;
            }
            try {
                const depsJson = await context.packageManager.readDepsJson();
                const allDeps = {
                    ...depsJson.dependencies,
                    ...depsJson.devDependencies
                };
                let packagesToUninstall = packages;
                // Если пакеты не указаны, показываем интерактивный выбор
                if (!packages.length) {
                    const installedPackages = Object.keys(allDeps);
                    if (!installedPackages.length) {
                        console.log(chalk.yellow('Нет установленных пакетов'));
                        return;
                    }
                    const answers = await inquirer.prompt([
                        {
                            type: 'checkbox',
                            name: 'packages',
                            message: 'Выберите пакеты для удаления:',
                            choices: installedPackages.map(pkg => ({
                                name: `${pkg}@${allDeps[pkg]}`,
                                value: pkg
                            }))
                        }
                    ]);
                    packagesToUninstall = answers.packages;
                }
                if (!packagesToUninstall.length) {
                    console.log(chalk.yellow('Не выбрано ни одного пакета'));
                    return;
                }
                // Запрашиваем подтверждение, если не указан флаг --yes
                if (!options.yes) {
                    const { confirm } = await inquirer.prompt([
                        {
                            type: 'confirm',
                            name: 'confirm',
                            message: `Удалить следующие пакеты?\n${packagesToUninstall.join(', ')}`,
                            default: false
                        }
                    ]);
                    if (!confirm) {
                        console.log(chalk.yellow('Операция отменена'));
                        return;
                    }
                }
                const spinner = createSpinner('Удаление пакетов...').start();
                await context.packageManager.uninstallDependencies(packagesToUninstall);
                spinner.success({ text: chalk.green('✨ Пакеты успешно удалены') });
            }
            catch (error) {
                console.error(chalk.red(`❌ Ошибка: ${error.message}`));
                process.exit(1);
            }
        });
    }
};
export default plugin;
