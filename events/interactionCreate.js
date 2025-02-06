module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (!interaction.isCommand()) return;

        const command = client.commands.get(interaction.commandName);
        if (!command) return;

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(`Hiba történt a(z) ${interaction.commandName} parancs végrehajtása közben:`, error);
            interaction.reply({
                content: 'Hiba történt a parancs végrehajtása közben.',
                ephemeral: true
            });
        }
    }
};
