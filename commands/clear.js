const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Delete all messages in the channel.'),
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            return interaction.reply({
                content: 'You do not have permission to delete messages.',
                ephemeral: true // Visible only to the user
            });
        }

        try {
            const messages = await interaction.channel.messages.fetch();
            await interaction.channel.bulkDelete(messages, true);

            // Confirmation response
            await interaction.reply({
                content: 'The channel content has been successfully cleared. Disappearing in 5 seconds...'
            });

            // Fetch the response message after reply
            const confirmationMessage = await interaction.fetchReply();

            // Countdown update
            for (let i = 4; i >= 0; i--) {
                await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
                await confirmationMessage.edit(`The channel content has been successfully cleared. Disappearing in ${i} seconds...`);
            }

            // Delete the confirmation message
            await confirmationMessage.delete();
        } catch (err) {
            console.error('Error occurred while deleting messages:', err);
            interaction.reply({
                content: 'Failed to delete messages.',
                ephemeral: true
            });
        }
    }
};
