const {
    SlashCommandBuilder, InteractionContextType, MessageFlags, EmbedBuilder
} = require("discord.js");

const fs = require("fs");
const path = require("path");

const { fetchStats } = require("../api/hypixel");
const { buildEmbed } = require("../utils/embed");
const { buildMenu } = require("../utils/menus");

const { cache, CACHE_TIME } = require("../utils/cache");
const {embedTag} = require("../utils/tagEmbed");

const linkPath = path.join(__dirname, "../data/link.json");

module.exports = {

    data: new SlashCommandBuilder()
        .setName("bedwars")
        .setDescription("Show player's BedWars stats")
        .addStringOption(option =>
            option
                .setName("player")
                .setDescription("Minecraft username")
                .setRequired(false)
        )
        .setContexts(InteractionContextType.PrivateChannel, InteractionContextType.BotDM, InteractionContextType.Guild),

    async execute(interaction) {

        await interaction.deferReply();

        const linkDB = JSON.parse(fs.readFileSync(linkPath, "utf8"));

        let username = interaction.options.getString("player");

        if (!username) {

            const linked = linkDB[interaction.user.id];

            if (!linked) {
                return interaction.editReply({content: "You are not linked.", flags: MessageFlags.Ephemeral});
            }

            username = linked.username;
        }

        const now = Date.now();

        let stats;

        if (cache.has(username)) {
            const cached = cache.get(username);

            if (now - cached.time < CACHE_TIME) {
                stats = cached.data;
            } else {
                cache.delete(username);
            }
        }

        if (!stats) {
            stats = await fetchStats(username);

            if (!stats) {
                return interaction.editReply({embeds: [new EmbedBuilder().setTitle("Invalid Player").setDescription(`No player by the username of \`\`${username}\`\` was found!`).setColor(0xFF0000)]});
            }

            cache.set(username, {
                data: stats,
                time: now
            });
        }

        let mode = "overall";

        const embed = buildEmbed(username, mode, stats, cache.get(username).time);
        const menu = buildMenu(mode, "mode_select_statsbot:" + username);

        const tag = await embedTag(username);

        await interaction.editReply({
            embeds: [embed, tag],
            components: menu,
        });

    }

};