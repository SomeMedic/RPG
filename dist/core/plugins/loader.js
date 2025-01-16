export async function loadPlugins(program, context) {
    const pluginContext = {
        program,
        packageManager: context.packageManager,
        dependencyResolver: context.dependencyResolver,
        installer: context.installer
    };
    try {
        // Загружаем встроенные плагины
        const plugins = [
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
            }
            catch (error) {
                console.error(`Ошибка загрузки плагина ${plugin.name}:`, error);
            }
        }
    }
    catch (error) {
        console.error('Ошибка загрузки плагинов:', error);
    }
}
