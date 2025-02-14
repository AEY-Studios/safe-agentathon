const axios = require('axios');
require('dotenv').config();

async function triggerAgent(projectID,agent_id,conversation_id,message, role = "user") {
  const headers = {
    'Content-Type': 'application/json',
    'region': 'd7b62b',
    'Authorization': `${projectID}:${process.env.AGENT_API_KEY}`,
  };

  const data = {
    message: {
      role: role,
      content: message
    },
    agent_id,
    conversation_id: String(conversation_id)
  };
  try {
    const response = await axios.post(process.env.BASE_URL, data, { headers });
    return response.data;
  } catch (error) {
    throw new Error(error.response ? JSON.stringify(error.response.data) : error.message);
  }
}

module.exports = { triggerAgent };
