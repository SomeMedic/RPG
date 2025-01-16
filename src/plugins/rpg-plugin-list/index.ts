import { Plugin, PluginContext } from '../../core/plugins/Plugin.js';
import chalk from 'chalk';
import { createSpinner } from 'nanospinner';
import { readFile } from 'fs/promises';
import { join } from 'path';

interface PackageInfo {
  name: string;
  version: string;
  description: string;
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
}

const plugin: Plugin = {
  name: 'rpg-plugin-list',
  version: '1.0.0',
  description: 'Просмотр установленных пакетов',
  hooks: {},
  async init(context: PluginContext) {
    if (!context.program) return;

    context.program
      .command('list')
      .alias('ls')
      .description('Просмотр установленных пакетов')
      .option('-d, --depth <depth>', 'Глубина отображения зависимостей', '0')
      .option('-p, --prod', 'Показать только production зависимости')
      .option('-D, --dev', 'Показать только dev зависимости')
      .option('-j, --json', 'Вывод в формате JSON')
      .action(async (options) => {
        if (!context.packageManager) {
          console.error(chalk.red('PackageManager не инициализирован'));
          return;
        }

        try {
          const spinner = createSpinner('Получение информации о пакетах...').start();
          
          const depsJson = await context.packageManager.readDepsJson();
          const packageInfo = await getPackageInfo();

          spinner.success({ text: 'Информация получена' });

          // Объединяем зависимости из package.json и deps.json
          let dependencies = {
            ...(packageInfo.dependencies || {}),
            ...(depsJson.dependencies || {})
          };
          let devDependencies = {
            ...(packageInfo.devDependencies || {}),
            ...(depsJson.devDependencies || {})
          };

          // Фильтрация по типу зависимостей
          if (options.prod) {
            devDependencies = {};
          }
          if (options.dev) {
            dependencies = {};
          }

          // Вывод в формате JSON
          if (options.json) {
            console.log(JSON.stringify({
              name: packageInfo.name,
              version: packageInfo.version,
              dependencies,
              devDependencies
            }, null, 2));
            return;
          }

          // Вывод информации о проекте
          console.log(`\n${chalk.bold(packageInfo.name)}@${packageInfo.version}`);
          if (packageInfo.description) {
            console.log(chalk.gray(packageInfo.description));
          }

          // Вывод зависимостей
          const depEntries = Object.entries(dependencies);
          if (depEntries.length > 0) {
            console.log(`\n${chalk.bold('Dependencies:')}`);
            for (const [name, version] of depEntries) {
              console.log(`  ${chalk.green(name)}@${chalk.yellow(version.toString())}`);
            }
          }

          // Вывод dev-зависимостей
          const devDepEntries = Object.entries(devDependencies);
          if (devDepEntries.length > 0) {
            console.log(`\n${chalk.bold('DevDependencies:')}`);
            for (const [name, version] of devDepEntries) {
              console.log(`  ${chalk.blue(name)}@${chalk.yellow(version.toString())}`);
            }
          }

          // Вывод общей статистики
          const totalDeps = depEntries.length;
          const totalDevDeps = devDepEntries.length;
          
          console.log(`\n${chalk.gray('Всего:')} ${totalDeps + totalDevDeps} (${totalDeps} dependencies, ${totalDevDeps} devDependencies)`);
        } catch (error: any) {
          console.error(chalk.red(`❌ Ошибка: ${error.message}`));
          process.exit(1);
        }
      });
  }
};

// Получение информации о пакете из package.json
async function getPackageInfo(): Promise<PackageInfo> {
  try {
    const packageJsonPath = join(process.cwd(), 'package.json');
    const content = await readFile(packageJsonPath, 'utf-8');
    const info = JSON.parse(content);
    
    return {
      name: info.name || 'unnamed-package',
      version: info.version || '0.0.0',
      description: info.description || '',
      dependencies: info.dependencies || {},
      devDependencies: info.devDependencies || {}
    };
  } catch (error) {
    throw new Error('Не удалось прочитать package.json');
  }
}

export default plugin; 