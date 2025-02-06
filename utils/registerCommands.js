const { REST, Routes } = require('discord.js');

module.exports = async function registerCommands(client, commands) {
    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

    try {
        console.log('Parancsok regisztrálása folyamatban...');
        // A `commands` tömbben mostantól a `data.toJSON()`-t kell használni
        
        await rest.put(
            Routes.applicationCommands(client.user.id),
            { body: commands }
        );

        console.log('Parancsok sikeresen regisztrálva.');
    } catch (error) {
        console.error('Hiba a parancsok regisztrálásakor:', error);
    }
};
