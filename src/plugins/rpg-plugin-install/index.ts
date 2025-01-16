import { Plugin, PluginContext } from '../../core/plugins/Plugin.js';
import chalk from 'chalk';
import { join } from 'path';
import { existsSync } from 'fs';
import inquirer from 'inquirer';
import { createSpinner } from 'nanospinner';

const plugin: Plugin = {
  name: 'rpg-plugin-install',
  version: '1.0.0',
  description: 'Установка зависимостей',
  hooks: {},
  async init(context: PluginContext) {
    const program = context.program;
    if (!program) return;

    program
      .command('install [packages...]')
      .description('Установить зависимости')
      .option('-D, --save-dev', 'Установить как devDependency')
      .action(async (packages: string[], options) => {
        try {
          const packageJsonPath = join(process.cwd(), 'package.json');
          if (!existsSync(packageJsonPath)) {
            console.error(chalk.red('❌ package.json не найден в текущей директории'));
            return;
          }

          if (!context.packageManager) {
            console.error(chalk.red('❌ PackageManager не инициализирован'));
            return;
          }

          // Если нет указанных пакетов, устанавливаем все зависимости из package.json
          if (!packages.length) {
            try {
              await context.packageManager.installDependencies();
            } catch (error) {
              process.exit(1);
            }
            return;
          }

          // Если указаны пакеты, показываем интерактивный выбор
          const { selectedPackages } = await inquirer.prompt<{ selectedPackages: string[] }>([
            {
              type: 'checkbox',
              name: 'selectedPackages',
              message: 'Выберите пакеты для установки:',
              choices: packages.map(pkg => ({
                name: pkg,
                checked: true
              }))
            }
          ]);

          if (!selectedPackages.length) {
            console.log(chalk.yellow('\nНе выбрано ни одного пакета'));
            return;
          }

          // Спрашиваем про devDependencies, если не указан флаг
          let isDev = options.saveDev;
          if (!options.saveDev) {
            const { confirmDev } = await inquirer.prompt<{ confirmDev: boolean }>([
              {
                type: 'confirm',
                name: 'confirmDev',
                message: 'Установить как devDependency?',
                default: false
              }
            ]);
            isDev = confirmDev;
          }

          try {
            await context.packageManager.installDependencies(selectedPackages, isDev);
          } catch (error) {
            process.exit(1);
          }
        } catch (error: any) {
          console.error(chalk.red(`❌ Ошибка: ${error.message}`));
          process.exit(1);
        }
      });
  }
};

export default plugin; 