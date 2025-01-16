export class DependencyResolver {
    constructor(packageManager) {
        this.packageManager = packageManager;
    }
    async resolveDependencies(name, version) {
        const resolved = new Map();
        await this.resolveDependencyTree(name, version, resolved, new Map());
        return resolved;
    }
    async resolveDependencyTree(name, version, resolved, parentPeerDeps) {
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
    extractPeerDependencies(peerDeps) {
        return new Map(Object.entries(peerDeps));
    }
}
