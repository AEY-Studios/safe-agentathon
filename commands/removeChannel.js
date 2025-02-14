const { SlashCommandBuilder,PermissionsBitField } = require('discord.js');
const channelList = require('../utils/channelList');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('removechannel')
        .setDescription('Removes the current channel from the watch list.'),
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({
                content: 'You do not have permission.',
                ephemeral: true 
            });
        }
        const channelId = interaction.channel.id;

        const agentId = channelList.getAgentByChannel(channelId);
        if (agentId) {
            channelList.removeChannel(channelId);
            await interaction.reply(`Channel with ID ${channelId} and agent ID ${agentId} removed from the watch list.`);
        } else {
            await interaction.reply(`Channel with ID ${channelId} is not in the watch list.`);
        }
    }
};
