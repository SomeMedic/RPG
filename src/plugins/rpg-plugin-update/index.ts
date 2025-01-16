import { Plugin, PluginContext } from '../../core/plugins/Plugin.js';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { createSpinner } from 'nanospinner';
import { spawn } from 'child_process';
import semver from 'semver';
import { platform } from 'os';

const isWindows = platform() === 'win32';
const npmCmd = isWindows ? 'npm.cmd' : 'npm';

interface PackageInfo {
  name: string;
  currentVersion: string;
  latestVersion: string;
  hasUpdate: boolean;
}

interface UpdateAnswers {
  packages: string[];
  confirm: boolean;
}

const plugin: Plugin = {
  name: 'rpg-plugin-update',
  version: '1.0.0',
  description: 'Обновление пакетов',
  hooks: {},
  async init(context: PluginContext) {
    if (!context.program) return;

    context.program
      .command('update [packages...]')
      .description('Обновить пакеты')
      .option('-y, --yes', 'Пропустить подтверждение')
      .action(async (packages: string[], options) => {
        if (!context.packageManager) {
          console.error(chalk.red('PackageManager не инициализирован'));
          return;
        }

        try {
          const spinner = createSpinner('Проверка обновлений...').start();
          
          const depsJson = await context.packageManager.readDepsJson();
          const allDeps = {
            ...depsJson.dependencies,
            ...depsJson.devDependencies
          };

          // Получаем информацию о последних версиях пакетов
          const packagesInfo: PackageInfo[] = [];
          
          for (const [name, version] of Object.entries(allDeps)) {
            if (packages.length && !packages.includes(name)) continue;
            
            const latestVersion = await getLatestVersion(name);
            if (!latestVersion) continue;

            const currentVersion = version.toString();
            const hasUpdate = semver.gt(latestVersion, currentVersion);
            
            packagesInfo.push({
              name,
              currentVersion,
              latestVersion,
              hasUpdate
            });
          }

          spinner.success({ text: 'Проверка обновлений завершена' });

          const updatablePackages = packagesInfo.filter(p => p.hasUpdate);
          
          if (!updatablePackages.length) {
            console.log(chalk.green('✨ Все пакеты обновлены до последних версий'));
            return;
          }

          console.log('\nДоступны обновления:');
          updatablePackages.forEach(pkg => {
            console.log(
              `  ${pkg.name}: ${chalk.yellow(pkg.currentVersion)} → ${chalk.green(pkg.latestVersion)}`
            );
          });

          let packagesToUpdate = updatablePackages.map(p => p.name);

          // Если не указан флаг --yes, запрашиваем подтверждение
          if (!options.yes) {
            const answers = await inquirer.prompt<UpdateAnswers>([
              {
                type: 'checkbox',
                name: 'packages',
                message: 'Выберите пакеты для обновления:',
                choices: updatablePackages.map(pkg => ({
                  name: `${pkg.name} (${pkg.currentVersion} → ${pkg.latestVersion})`,
                  value: pkg.name,
                  checked: true
                }))
              },
              {
                type: 'confirm',
                name: 'confirm',
                message: 'Обновить выбранные пакеты?',
                default: true
              }
            ]);

            if (!answers.confirm) {
              console.log(chalk.yellow('Операция отменена'));
              return;
            }

            packagesToUpdate = answers.packages;
          }

          if (!packagesToUpdate.length) {
            console.log(chalk.yellow('Не выбрано ни одного пакета'));
            return;
          }

          const updateSpinner = createSpinner('Обновление пакетов...').start();

          // Формируем команды установки с конкретными версиями
          const installCommands = packagesToUpdate.map(name => {
            const pkg = updatablePackages.find(p => p.name === name);
            return `${name}@${pkg?.latestVersion}`;
          });

          await context.packageManager.installDependencies(installCommands);
          
          updateSpinner.success({ text: chalk.green('✨ Пакеты успешно обновлены') });
        } catch (error: any) {
          console.error(chalk.red(`❌ Ошибка: ${error.message}`));
          process.exit(1);
        }
      });
  }
};

// Получение последней версии пакета из npm registry
async function getLatestVersion(packageName: string): Promise<string | null> {
  return new Promise((resolve) => {
    const child = spawn(npmCmd, ['view', packageName, 'version'], {
      stdio: ['ignore', 'pipe', 'ignore'],
      cwd: process.cwd()
    });

    let output = '';
    
    child.stdout?.on('data', (data) => {
      output += data.toString();
    });

    child.on('error', () => {
      resolve(null);
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve(output.trim());
      } else {
        resolve(null);
      }
    });
  });
}

export default plugin; 