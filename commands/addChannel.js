const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const channelList = require('../utils/channelList');
const agentConfigs = require('../utils/agentConfig'); 
const {triggerAgent} = require('../utils/communicateWithAgent'); 
module.exports = {
    data: new SlashCommandBuilder()
        .setName('addchannel')
        .setDescription('Adds the current channel to the watch list.')
        .addStringOption(option =>
            option.setName('agent')
                .setDescription('Select an agent')
                .setRequired(true)
                .addChoices(
                    ...agentConfigs.map(agent => ({ name: agent.name, value: agent.id }))
                )
        )
        .addStringOption(option =>
            option.setName('context')
                .setDescription('Context or additional information for this channel')
                .setRequired(true)
        ),
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({
                content: 'You do not have permission.',
                ephemeral: true 
            });
        }
        const channelId = interaction.channel.id;
        const context = interaction.options.getString('context');
        const selectedAgentId = interaction.options.getString('agent');
        const selectedAgent = agentConfigs.find(agent => agent.id === selectedAgentId);

        if (!selectedAgent) {
            return interaction.reply('Invalid agent selected.');
        }

        if (!channelList.getAgentByChannel(channelId)) {
            channelList.addChannel(channelId, selectedAgentId);

            try {
                await triggerAgent(selectedAgent.agent_project_id, selectedAgent.agent_id, channelId, selectedAgent.discordInitText + context)
                await interaction.reply(`Channel with ID ${channelId} added to the watch list, and context sent to ${selectedAgent.name}.`);
            } catch (error) {
                console.error('Error sending data to agent API:', error);
                await interaction.reply(`Channel added, but there was an error sending the context to ${selectedAgent.name}.`);
            }
        } else {
            const agentId = channelList.getAgentByChannel(channelId);
            await interaction.reply(`Channel with ID ${channelId} is already in the watch list with agent ID ${agentId}.`);
        }
    },
};
