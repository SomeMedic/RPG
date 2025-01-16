import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import axios from 'axios';
import { createWriteStream, mkdirSync, existsSync } from 'fs';
import tar from 'tar';
import { promisify } from 'util';
import { pipeline } from 'stream';
import { spawn } from 'child_process';
import chalk from 'chalk';
import { platform } from 'os';
const streamPipeline = promisify(pipeline);
export class PackageManager {
    constructor(workspacePath) {
        this.workspacePath = workspacePath;
        this.depsJsonPath = join(workspacePath, 'deps.json');
        this.npmRegistry = 'https://registry.npmjs.org';
    }
    async installDependencies(packages = [], isDev = false) {
        // Если указаны конкретные пакеты, устанавливаем их
        if (packages.length > 0) {
            const args = ['install', ...packages];
            if (isDev) {
                args.push('--save-dev');
            }
            const npmCmd = platform() === 'win32' ? 'npm.cmd' : 'npm';
            const child = spawn(npmCmd, args, {
                cwd: this.workspacePath,
                stdio: ['inherit', 'pipe', 'pipe'],
                shell: true
            });
            // Обрабатываем вывод
            child.stdout?.on('data', (data) => {
                const output = data.toString()
                    .replace(/npm WARN/gi, 'rpg WARN')
                    .replace(/npm notice/gi, 'rpg notice')
                    .replace(/npm ERR!/gi, 'rpg ERROR');
                process.stdout.write(output);
            });
            child.stderr?.on('data', (data) => {
                const output = data.toString()
                    .replace(/npm WARN/gi, 'rpg WARN')
                    .replace(/npm notice/gi, 'rpg notice')
                    .replace(/npm ERR!/gi, 'rpg ERROR');
                process.stderr.write(output);
            });
            return new Promise((resolve, reject) => {
                child.on('error', reject);
                child.on('exit', (code) => {
                    if (code === 0) {
                        resolve();
                    }
                    else {
                        reject(new Error(`Ошибка установки зависимостей (код ${code})`));
                    }
                });
            });
        }
        // Иначе устанавливаем все зависимости из deps.json
        const depsJson = await this.readDepsJson();
        const allDeps = {
            ...depsJson.dependencies,
            ...depsJson.devDependencies
        };
        if (Object.keys(allDeps).length === 0) {
            return;
        }
        const npmCmd = platform() === 'win32' ? 'npm.cmd' : 'npm';
        const child = spawn(npmCmd, ['install'], {
            cwd: this.workspacePath,
            stdio: ['inherit', 'pipe', 'pipe'],
            shell: true
        });
        // Обрабатываем вывод
        child.stdout?.on('data', (data) => {
            const output = data.toString()
                .replace(/npm WARN/gi, 'rpg WARN')
                .replace(/npm notice/gi, 'rpg notice')
                .replace(/npm ERR!/gi, 'rpg ERROR');
            process.stdout.write(output);
        });
        child.stderr?.on('data', (data) => {
            const output = data.toString()
                .replace(/npm WARN/gi, 'rpg WARN')
                .replace(/npm notice/gi, 'rpg notice')
                .replace(/npm ERR!/gi, 'rpg ERROR');
            process.stderr.write(output);
        });
        return new Promise((resolve, reject) => {
            child.on('error', reject);
            child.on('exit', (code) => {
                if (code === 0) {
                    resolve();
                }
                else {
                    reject(new Error(`Ошибка установки зависимостей (код ${code})`));
                }
            });
        });
    }
    async uninstallDependencies(packages) {
        const args = ['uninstall', ...packages];
        const child = spawn('npm', args, {
            stdio: ['inherit', 'pipe', 'pipe'],
            shell: true
        });
        // Обработка stdout
        child.stdout?.on('data', (data) => {
            const output = data.toString()
                .replace(/npm WARN/gi, chalk.yellow('rpg WARN'))
                .replace(/npm notice/gi, chalk.blue('rpg notice'))
                .replace(/npm ERR!/gi, chalk.red('rpg ERROR'));
            process.stdout.write(output);
        });
        // Обработка stderr
        child.stderr?.on('data', (data) => {
            const output = data.toString()
                .replace(/npm WARN/gi, chalk.yellow('rpg WARN'))
                .replace(/npm notice/gi, chalk.blue('rpg notice'))
                .replace(/npm ERR!/gi, chalk.red('rpg ERROR'));
            process.stderr.write(output);
        });
        return new Promise((resolve, reject) => {
            child.on('close', (code) => {
                if (code === 0) {
                    resolve();
                }
                else {
                    reject(new Error(`Ошибка при удалении пакетов (код ${code})`));
                }
            });
        });
    }
    async readDepsJson() {
        try {
            const content = await readFile(this.depsJsonPath, 'utf-8');
            return JSON.parse(content);
        }
        catch (error) {
            return {};
        }
    }
    async writeDepsJson(depsJson) {
        await writeFile(this.depsJsonPath, JSON.stringify(depsJson, null, 2));
    }
    async getLocalDependency(name, version) {
        const depsJson = await this.readDepsJson();
        const dep = depsJson.dependencies?.[name] || depsJson.devDependencies?.[name];
        if (dep && dep.version === version) {
            return dep;
        }
        return null;
    }
    async getDependencyInfo(packageName, isDev = false) {
        const depsJson = await this.readDepsJson();
        const dependencies = isDev ? (depsJson.devDependencies || {}) : (depsJson.dependencies || {});
        return dependencies[packageName] || null;
    }
    async getPackageInfo(packageName, version) {
        const url = version
            ? `${this.npmRegistry}/${packageName}/${version}`
            : `${this.npmRegistry}/${packageName}`;
        const response = await axios.get(url);
        const info = response.data;
        // Если версия не указана, используем последнюю стабильную
        if (!version) {
            info.version = info['dist-tags'].latest;
        }
        return info;
    }
    async downloadPackage(packageName, version, targetDir) {
        // Создаем директорию node_modules, если она не существует
        const nodeModulesPath = join(this.workspacePath, 'node_modules');
        if (!existsSync(nodeModulesPath)) {
            mkdirSync(nodeModulesPath, { recursive: true });
        }
        // Создаем директорию для конкретного пакета
        const packageDir = join(nodeModulesPath, packageName);
        if (!existsSync(packageDir)) {
            mkdirSync(packageDir, { recursive: true });
        }
        // Получаем информацию о конкретной версии пакета
        const packageInfo = await this.getPackageInfo(packageName, version);
        const tarballUrl = packageInfo.dist.tarball;
        if (!tarballUrl) {
            throw new Error(`Не удалось получить URL для скачивания пакета ${packageName}@${version}`);
        }
        const tempTarballPath = join(nodeModulesPath, `${packageName}-${version}.tgz`);
        const response = await axios({
            method: 'get',
            url: tarballUrl,
            responseType: 'stream'
        });
        await streamPipeline(response.data, createWriteStream(tempTarballPath));
        // Распаковываем в директорию пакета
        await tar.x({
            file: tempTarballPath,
            cwd: packageDir,
            strip: 1 // Убираем первую директорию package из архива
        });
    }
}
