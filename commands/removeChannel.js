const { SlashCommandBuilder } = require('discord.js');
const channelList = require('../utils/channelList');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('removechannel')
        .setDescription('Removes the current channel from the watch list.'),
    async execute(interaction) {
        const channelId = interaction.channel.id;

        // Ellenőrizzük, hogy a csatorna ID benne van-e a listában
        const agentId = channelList.getAgentByChannel(channelId);
        if (agentId) {
            // Eltávolítjuk a csatornát a listából
            channelList.removeChannel(channelId);
            await interaction.reply(`Channel with ID ${channelId} and agent ID ${agentId} removed from the watch list.`);
        } else {
            await interaction.reply(`Channel with ID ${channelId} is not in the watch list.`);
        }
    }
};
