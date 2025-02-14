require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { loadCommands } = require('./utils/loadCommands');
const fs = require('fs');
const path = require('path');
const registerCommands = require('./utils/registerCommands'); 
const {startTelegramBots } = require('./telegram/telegramManager'); 
// Bot inicializálása
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Parancsok gyűjteményének létrehozása
client.commands = new Collection();

// -- Parancsok betöltése a segédfájl segítségével:
const commands = loadCommands(client);

// Események betöltése
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);

    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
    } else {
        client.on(event.name, (...args) => event.execute(...args, client));
    }
}

client.once('ready', async () => {
    console.log('Bot ready!');

    if (registerCommands) {
      await registerCommands(client, commands);
    }
});

client.login(process.env.DISCORD_TOKEN);
startTelegramBots();
module.exports = client;