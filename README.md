# Safe Agentathon

## Overview
Safe Agentathon is a Discord bot built using `discord.js` that provides an interface for managing commands and events dynamically. It utilizes `dotenv` for environment configuration and `axios` for external API interactions.

## Features
- Dynamic command loading
- Event-driven architecture
- Uses `discord.js` for seamless bot interaction
- Supports environment configuration with `dotenv`
- Automated development server restart with `nodemon`

## Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (version 18 or higher)
- [npm](https://www.npmjs.com/)

## Installation
Clone the repository and install dependencies:
```sh
git clone https://github.com/AEY-Studios/safe-agentathon.git
cd safe-agentathon
npm install
```

## Configuration
Create a `.env` file in the root directory and set up the following variables:
```env
DISCORD_TOKEN=your_discord_bot_token
```

## Running the Bot
To start the bot:
```sh
node server.js
```
For development, you can use `nodemon`:
```sh
npm run devstart
```

## Project Structure
```
safe-agentathon/
├── events/             # Event handlers
├── commands/           # Bot commands
├── utils/              # Utility functions (e.g., command loader)
├── .env                # Environment variables
├── server.js           # Main bot logic
├── package.json        # Project dependencies
└── README.md           # Documentation
```

## Repository
GitHub: [Safe Agentathon Repository](https://github.com/AEY-Studios/safe-agentathon)

## Bug Reports
Report issues here: [Bug Tracker](https://github.com/AEY-Studios/safe-agentathonissues)

## Contributing
1. Fork the repository
2. Create a new branch (`git checkout -b feature-branch`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to your fork (`git push origin feature-branch`)
5. Create a pull request

## License
This project is licensed under the ISC License.

