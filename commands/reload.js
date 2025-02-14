
const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const { loadCommands } = require('../utils/loadCommands');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('reload')
        .setDescription('Reload all commands.'),
    async execute(interaction, client) {
        try {
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                return interaction.reply({
                    content: 'You do not have permission.',
                    ephemeral: true 
                });
            }
            const client = require('../server');

            const commands = loadCommands(client);

            const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
            await rest.put(
                Routes.applicationCommands(client.user.id),
                { body: commands }
            );

            await interaction.reply('All commands have been successfully reloaded and registered!');
        } catch (error) {
            console.error('Error reloading commands:', error);
            await interaction.reply('Failed to reload commands.');
        }
    },
};
