import { join } from 'path';
import { existsSync } from 'fs';
export class PackageInstaller {
    constructor(packageManager, dependencyResolver) {
        this.packageManager = packageManager;
        this.dependencyResolver = dependencyResolver;
    }
    async installPackage(name, version, isDev = false) {
        // Проверяем, установлен ли уже пакет
        const localDep = await this.packageManager.getLocalDependency(name, version);
        if (localDep) {
            return;
        }
        // Получаем информацию о пакете
        const packageInfo = await this.packageManager.getPackageInfo(name, version);
        // Создаем директорию для пакета
        const packageDir = join(process.cwd(), 'node_modules', name);
        if (!existsSync(packageDir)) {
            await this.packageManager.downloadPackage(name, version, packageDir);
        }
        // Устанавливаем зависимости пакета
        const dependencies = await this.dependencyResolver.resolveDependencies(name, version);
        for (const [depName, depVersion] of dependencies) {
            await this.installPackage(depName, depVersion);
        }
    }
    async installDependencies(packages = [], isDev = false) {
        for (const pkg of packages) {
            const [name, version] = pkg.split('@');
            const resolvedVersion = version || 'latest';
            await this.installPackage(name, resolvedVersion, isDev);
        }
    }
}
