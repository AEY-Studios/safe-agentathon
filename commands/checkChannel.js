const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const channelList = require('../utils/channelList'); 

module.exports = {
    data: new SlashCommandBuilder()
        .setName('checkchannel')
        .setDescription('Checks if the current channel is in the watch list.'),
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({
                content: 'You do not have permission.',
                ephemeral: true 
            });
        }
        const channelId = interaction.channel.id;

        // Lekérdezzük az ügynököt a csatorna alapján
        const agentId = channelList.getAgentByChannel(channelId);

        if (agentId) {
            await interaction.reply(`Channel with ID ${channelId} is in the watch list, associated with agent ID ${agentId}.`);
        } else {
            await interaction.reply(`Channel with ID ${channelId} is not in the watch list.`);
        }
    }
};
