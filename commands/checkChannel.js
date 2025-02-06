const { SlashCommandBuilder } = require('discord.js');
const channelList = require('../utils/channelList'); // Az új struktúrához igazítva

module.exports = {
    data: new SlashCommandBuilder()
        .setName('checkchannel')
        .setDescription('Checks if the current channel is in the watch list.'),
    async execute(interaction) {
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
