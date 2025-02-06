const { debug } = require('console');
const fs = require('fs');
const path = require('path');

function loadCommands(client) {
  // A commands mappa relatív útvonala
  const commandsPath = path.join(__dirname, '../commands');
  // Csak a .js kiterjesztésű fájlokat olvassuk be
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

  // Az esetleges régi parancs-gyűjtemény ürítése
  client.commands.clear();

  const commands = [];
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    // A require cache törlése, hogy frissüljenek a parancsok
    delete require.cache[require.resolve(filePath)];

    const command = require(filePath);
    // Parancs regisztrálása a Discord kliensben
    client.commands.set(command.data.name, command);
    // A slash-API-hez szükségünk lesz a `.toJSON()` formára
    commands.push(command.data.toJSON());
  }

  return commands;
}

module.exports = { loadCommands };
