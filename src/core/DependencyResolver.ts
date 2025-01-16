import { PackageManager } from './PackageManager.js';

export class DependencyResolver {
  constructor(private packageManager: PackageManager) {}

  async resolveDependencies(name: string, version: string): Promise<Map<string, string>> {
    const resolved = new Map<string, string>();
    await this.resolveDependencyTree(name, version, resolved, new Map());
    return resolved;
  }

  private async resolveDependencyTree(
    name: string,
    version: string,
    resolved: Map<string, string>,
    parentPeerDeps: Map<string, string>
  ): Promise<void> {
    // Если пакет уже разрешен с той же версией, пропускаем
    if (resolved.has(name) && resolved.get(name) === version) {
      return;
    }

    // Получаем информацию о локальной версии пакета
    const localDep = await this.packageManager.getLocalDependency(name, version);

    // Объединяем peer-зависимости родителей с текущими
    const mergedPeerDeps = new Map([
      ...parentPeerDeps,
      ...this.extractPeerDependencies(localDep?.peerDependencies || {})
    ]);

    // Добавляем текущий пакет в список разрешенных
    resolved.set(name, version);

    // Если у пакета есть зависимости, разрешаем их рекурсивно
    if (localDep?.dependencies) {
      for (const [depName, depVersion] of Object.entries(localDep.dependencies)) {
        await this.resolveDependencyTree(depName, depVersion, resolved, mergedPeerDeps);
      }
    }
  }

  private extractPeerDependencies(peerDeps: { [key: string]: string }): Map<string, string> {
    return new Map(Object.entries(peerDeps));
  }
} 