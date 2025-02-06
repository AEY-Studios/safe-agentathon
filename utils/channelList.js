const channelList = [];

module.exports = {
    addChannel: (channelId, agentId) => {
        if (!channelList.find(channel => channel.channelId === channelId)) {
            channelList.push({ channelId, agentId });
        }
    },
    removeChannel: (channelId) => {
        const index = channelList.findIndex(channel => channel.channelId === channelId);
        if (index !== -1) {
            channelList.splice(index, 1);
        }
    },
    getAgentByChannel: (channelId) => {
        const channel = channelList.find(channel => channel.channelId === channelId);
        return channel ? channel.agentId : null;
    },
    list: channelList,
};
