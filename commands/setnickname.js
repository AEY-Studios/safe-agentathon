const { SlashCommandBuilder,PermissionsBitField} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setnickname')
        .setDescription('Állítsd be a bot egyedi nicknevét.')
        .addStringOption(option =>
            option
                .setName('nickname')
                .setDescription('Az új becenév a bot számára.')
                .setRequired(true)
        ),
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                    return interaction.reply({
                        content: 'You do not have permission.',
                        ephemeral: true 
                    });
                }
        const newNickname = interaction.options.getString('nickname');

        try {
            await interaction.guild.members.me.setNickname(newNickname);
            await interaction.reply(`A bot új neve: **${newNickname}**`);
        } catch (error) {
            console.error('Hiba történt a nicknév módosításakor:', error);
            await interaction.reply('Nem sikerült módosítani a bot nevét.');
        }
    },
};
