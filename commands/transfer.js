const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const { mintSPLToken,transferSPLToken }  = require('../utils/web3'); 
const agentConfigs = require('../utils/agentConfig'); 
module.exports = {
    data: new SlashCommandBuilder()
        .setName('transfer')
        .setDescription('The address where the token will be sent!')
        .addStringOption(option =>
            option.setName('address')
                .setDescription('My wallet address')
                .setRequired(true)
        ).addStringOption(option =>
            option.setName('agent')
                .setDescription('Select an agent')
                .setRequired(true)
                .addChoices(
                    ...agentConfigs.map(agent => ({ name: agent.name, value: agent.id }))
                )
        ),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        const address = interaction.options.getString('address');
        const selectedAgentId = interaction.options.getString('agent');
        const selectedAgent = agentConfigs.find(agent => agent.id === selectedAgentId);
        try{
            await transferSPLToken(address, selectedAgent.tokenMint, selectedAgent.bosSecretKey)
            interaction.editReply({
                content: "Transaction has been a success",
                ephemeral: true 
            });
        }
        catch(error){
            interaction.editReply({
                content: 'Error: ' + error,
                ephemeral: true 
            });
        }
    }
};
