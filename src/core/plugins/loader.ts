import { Command } from 'commander';
import { Plugin, PluginContext } from './Plugin.js';
import { PackageManager } from '../PackageManager.js';
import { DependencyResolver } from '../DependencyResolver.js';
import { PackageInstaller } from '../PackageInstaller.js';

interface LoadPluginsContext {
  packageManager: PackageManager;
  dependencyResolver: DependencyResolver;
  installer: PackageInstaller;
}

export async function loadPlugins(program: Command, context: LoadPluginsContext): Promise<void> {
  const pluginContext: PluginContext = {
    program,
    packageManager: context.packageManager,
    dependencyResolver: context.dependencyResolver,
    installer: context.installer
  };

  try {
    // Загружаем встроенные плагины
    const plugins: Plugin[] = [
      (await import('../../plugins/rpg-plugin-install/index.js')).default,
      (await import('../../plugins/rpg-plugin-create/index.js')).default,
      (await import('../../plugins/rpg-plugin-run/index.js')).default,
      (await import('../../plugins/rpg-plugin-cli/index.js')).default,
      (await import('../../plugins/rpg-plugin-audit/index.js')).default,
      (await import('../../plugins/rpg-plugin-init/index.js')).default,
    ];

    // Инициализируем каждый плагин
    for (const plugin of plugins) {
      try {
        await plugin.init(pluginContext);
      } catch (error) {
        console.error(`Ошибка загрузки плагина ${plugin.name}:`, error);
      }
    }
  } catch (error) {
    console.error('Ошибка загрузки плагинов:', error);
  }
} 