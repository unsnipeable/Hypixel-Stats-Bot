const {
    SlashCommandBuilder, EmbedBuilder, InteractionContextType
} = require("discord.js");
const {buildMenu, MODES} = require("../utils/menus");

module.exports = {

    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("/play command")
        .addStringOption(option =>
            option
                .setName("mode")
                .setDescription("Bedwars Game mode")
                .addChoices(
                    Object.entries(MODES).map(([key, label]) => ({
                        name: label,
                        value: key
                    }))
                )
                .setRequired(true)
        )
        .setContexts(InteractionContextType.PrivateChannel, InteractionContextType.BotDM, InteractionContextType.Guild),

    async execute(interaction) {

        await interaction.deferReply();

        let mode = interaction.options.getString("mode");

        const modes = ["rush", "lucky", "swap", "ultimate", "voidless", "underworld"];

        let description;

        if (mode === "four_four_totallynormal") {
            description = `Commands for this mode no longer work.`;
        } else if (modes.includes(mode)) {
            description =
                `## ${MODES[mode]} Mode commands\n`+
                `\`\`\`/play bedwars_eight_two_${mode}\`\`\`\n` +
                `\`\`\`/play bedwars_four_four_${mode}\`\`\``;
        } else {
            description =
                `## ${MODES[mode]} Mode command\n`+
                `\`\`\`/play bedwars_${mode}\`\`\``;
        }


        const embed = new EmbedBuilder()
            .setDescription(description);

        const menu = buildMenu("overall", "play_select_statsbot");

        await interaction.editReply({
            embeds: [embed],
            components: menu
        });
    }

};