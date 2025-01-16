import { Command } from 'commander';
import { PluginManager } from './PluginManager.js';
import { Plugin } from './Plugin.js';

export function addPluginCommands(program: Command, pluginManager: PluginManager) {
  program
    .command('plugin:list')
    .description('Показать список установленных плагинов')
    .action(() => {
      console.log('Установленные плагины:');
      const plugins = pluginManager.getPlugins();
      plugins.forEach((plugin: Plugin) => {
        console.log(`- ${plugin.name} v${plugin.version}: ${plugin.description}`);
      });
    });
} 