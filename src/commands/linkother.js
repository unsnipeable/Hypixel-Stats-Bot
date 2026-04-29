const {
    SlashCommandBuilder,
    PermissionFlagsBits
} = require("discord.js");

const fs = require("fs");
const path = require("path");

const { fetchStats } = require("../api/hypixel");
let premium;

const linkPath = path.join(__dirname, "../data/link.json");

module.exports = {

    data: new SlashCommandBuilder()
        .setName("linkother")
        .setDescription("Link another user's Minecraft account")
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("Target user")
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("player")
                .setDescription("Minecraft username")
                .setRequired(true)
        ),

    async execute(interaction) {
        premium = JSON.parse(
            fs.readFileSync(
                path.join(__dirname, "../data/premium.json"),
                "utf8"
            )
        );

        const admins = premium.admins || [];

        if (!admins.includes(interaction.user.id)) {
            return interaction.reply({
                content: "Admin only",
                ephemeral: true
            });
        }
        await interaction.deferReply({ ephemeral: true });

        const user = interaction.options.getUser("user");
        const username = interaction.options.getString("player");

        const stats = await fetchStats(username);

        if (!stats) {
            return interaction.editReply("Player not found.");
        }

        if (stats.discordId !== user.username) {
            return interaction.editReply(`Their Discord ID does not match the ID linked in Hypixel.\nTheir Discord ID: \`${user.username}\`\nLinked in Hypixel: \`${stats.discordId}\``);
        }

        const linkDB = JSON.parse(fs.readFileSync(linkPath, "utf8"));

        linkDB[user.id] = {
            username
        };

        fs.writeFileSync(linkPath, JSON.stringify(linkDB, null, 2));

        await interaction.editReply(`Linked ${user.tag} → ${username}`);

    }

};