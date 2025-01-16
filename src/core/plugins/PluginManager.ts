import { Plugin } from './Plugin.js';
import { Command } from 'commander';
import { readdir } from 'fs/promises';
import { join } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export class PluginManager {
  private plugins: Plugin[] = [];

  constructor(private program: Command) {}

  async loadPlugins(): Promise<void> {
    try {
      // Загружаем встроенные плагины
      const pluginsDir = join(__dirname, '../../plugins');
      const entries = await readdir(pluginsDir, { withFileTypes: true });
      
      for (const entry of entries) {
        if (entry.isDirectory()) {
          try {
            const pluginPath = join(pluginsDir, entry.name, 'index.js');
            const pluginUrl = pathToFileURL(pluginPath).toString();
            const plugin = (await import(pluginUrl)).default;
            
            if (this.isValidPlugin(plugin)) {
              this.plugins.push(plugin);
            }
          } catch (error: any) {
            console.error(`Ошибка загрузки плагина ${entry.name}:`, error.message);
          }
        }
      }
    } catch (error: any) {
      console.error('Ошибка при загрузке плагинов:', error.message);
    }
  }

  private isValidPlugin(plugin: any): plugin is Plugin {
    return (
      plugin &&
      typeof plugin === 'object' &&
      typeof plugin.name === 'string' &&
      typeof plugin.version === 'string' &&
      typeof plugin.description === 'string' &&
      typeof plugin.init === 'function'
    );
  }

  async initializePlugins(context: any): Promise<void> {
    for (const plugin of this.plugins) {
      try {
        await plugin.init(context);
      } catch (error: any) {
        console.error(`Ошибка инициализации плагина ${plugin.name}:`, error.message);
      }
    }
  }

  getPlugins(): Plugin[] {
    return [...this.plugins];
  }
} 