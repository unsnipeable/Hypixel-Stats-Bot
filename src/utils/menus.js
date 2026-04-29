const {
    ActionRowBuilder,
    StringSelectMenuBuilder, ButtonBuilder, ButtonStyle
} = require("discord.js");

const MODES = {
    overall: "Overall",
    eight_one: "Solo",
    eight_two: "Doubles",
    four_three: "Threes",
    four_four: "Fours",
    two_four: "4v4",
    castle: "Castle",
    rush: "Rush",
    lucky: "Lucky Block",
    swap: "Swappage",
    ultimate: "Ultimate",
    voidless: "Voidless",
    underworld: "Underworld",
    four_four_totallynormal: "Totally Normal"
};

function buildMenu(selected = "overall", id) {
    const rows = [];

    rows.push(new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
            .setCustomId(id)
            .setPlaceholder("Select Mode")
            .addOptions(
                Object.entries(MODES).map(([key, label]) => ({
                    label,
                    value: key,
                    default: key === selected
                }))
            )
    ))

    if (id.includes(":")) {
        if (id.split(":")[0] === "mode_select_statsbot") {
            rows.push(new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId(`btn_switch_statsbot:${selected}:${id.split(":")[1]}`).setLabel('Show Void Stats').setStyle(ButtonStyle.Secondary)));
        }
        if (id.split(":")[0] === "mode_select_statsbot_void") {
            rows.push(new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId(`btn_switch_statsbot_void:${selected}:${id.split(":")[1]}`).setLabel('Show Normal Stats').setStyle(ButtonStyle.Secondary)));
        }
    }

    return rows;
}

module.exports = {
    buildMenu,
    MODES,
};