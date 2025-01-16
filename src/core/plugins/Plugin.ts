import { Command } from 'commander';
import { PackageManager } from '../PackageManager.js';
import { DependencyResolver } from '../DependencyResolver.js';
import { PackageInstaller } from '../PackageInstaller.js';

export interface PluginContext {
  program: Command | undefined;
  packageManager?: PackageManager;
  dependencyResolver?: DependencyResolver;
  installer?: PackageInstaller;
}

export interface Plugin {
  name: string;
  version: string;
  description: string;
  hooks: Record<string, unknown>;
  init: (context: PluginContext) => Promise<void>;
} 