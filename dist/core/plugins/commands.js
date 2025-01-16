export function addPluginCommands(program, pluginManager) {
    program
        .command('plugin:list')
        .description('Показать список установленных плагинов')
        .action(() => {
        console.log('Установленные плагины:');
        const plugins = pluginManager.getPlugins();
        plugins.forEach((plugin) => {
            console.log(`- ${plugin.name} v${plugin.version}: ${plugin.description}`);
        });
    });
}
