const channelList = require('../utils/channelList');
const agentConfigs = require('../utils/agentConfig'); 
const {triggerAgent} = require('../utils/communicateWithAgent'); 

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
        const msg = `${payload.userName} said on discord: ${payload.content}.
            message_id_input:${payload.messageId}
            channel_id_input:${payload.channelId}
            reply to it using the discord message tool!`;
        try {
            await triggerAgent(selectedAgent.agent_project_id, selectedAgent.agent_id, message.channel.id, msg)
            console.log('Üzenet sikeresen elküldve az API-nak.');
        } catch (error) {
            console.error('Hiba történt az API-hoz való küldés közben:', error);
        }
    },
};
