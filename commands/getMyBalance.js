const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const { mintSPLToken,transferSPLToken,checkMyBalance }  = require('../utils/web3'); 
const agentConfigs = require('../utils/agentConfig'); 
module.exports = {
    data: new SlashCommandBuilder()
        .setName('balance')
        .setDescription('Check my balance!')
        .addStringOption(option =>
            option.setName('address')
                .setDescription('My wallet address')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('agent')
                .setDescription('Select an agent')
                .setRequired(true)
                .addChoices(
                    ...agentConfigs.map(agent => ({ name: agent.name, value: agent.id }))
                )
        ),
    async execute(interaction) {
        const address = interaction.options.getString('address');
        const selectedAgentId = interaction.options.getString('agent');
        const selectedAgent = agentConfigs.find(agent => agent.id === selectedAgentId);
        try{
            const balance = await checkMyBalance(address, selectedAgent.tokenMint)
            const finalBalance = balance.value.amount / 1000000000
            interaction.reply({
                content: "My Balance: " + finalBalance,
                ephemeral: true 
            });
        }
        catch(error){
            interaction.reply({
                content: 'Error: ' + error,
                ephemeral: true 
            });
        }
    }
};
