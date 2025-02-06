const channelList = require('../utils/channelList');
const agentConfigs = require('../utils/agentConfig'); 
const axios = require('axios');

module.exports = {
    name: 'messageCreate',
    async execute(message, client) {
        if (message.author.bot) return;

        const agentId = channelList.getAgentByChannel(message.channel.id);
        if (!agentId) return;

        const selectedAgent = agentConfigs.find(agent => agent.id === agentId);
        if (!selectedAgent) return;

        const payload = {
            channelId: message.channel.id,
            userId: message.author.id,
            userName: message.author.username,
            globalName: message.author.globalName,
            messageId: message.id,
            content: message.content,
        };

        try {
            await axios.post(selectedAgent.msgURL, payload);
            console.log('Üzenet sikeresen elküldve az API-nak.');
        } catch (error) {
            console.error('Hiba történt az API-hoz való küldés közben:', error);
        }
    },
};
