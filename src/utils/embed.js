const { EmbedBuilder } = require("discord.js");
const { MODES } = require("./menus");

function buildEmbed(username, modeKey, stats, now, type = "normal") {

    const s = stats[modeKey];

    const wlr = ratio(s.win, s.loss);
    const bblr = ratio(s.bedbroken, s.bedlost);
    const kdr = ratio(s.kills, s.deaths);
    const fkdr = ratio(s.finalKills, s.finalDeaths);

    let emb = new EmbedBuilder()
        .setColor(0x000000)
        .setThumbnail("https://skins.mcstats.com/face/" + stats.uuid)
        .setDescription(`## \`\`[${stats.star}✫] ${stats.rank}${stats.name}\`\`\n> ### ${MODES[modeKey]} Mode`)

    if (type !== "void") {
        emb = emb.addFields(
            {name: "Wins", value: `${s.win}`, inline: true},
            {name: "Losses", value: `${s.loss}`, inline: true},
            {name: `${process.env.WIN_EMOJI} | WLR`, value: `${wlr}`, inline: true},

            {name: "Final Kills", value: `${s.finalKills}`, inline: true},
            {name: "Final Deaths", value: `${s.finalDeaths}`, inline: true},
            {name: `${process.env.FINAL_KILL_EMOJI} | FKDR`, value: `${fkdr}`, inline: true},

            {name: "Kills", value: `${s.kills}`, inline: true},
            {name: "Deaths", value: `${s.deaths}`, inline: true},
            {name: `${process.env.KILL_EMOJI} | KDR`, value: `${kdr}`, inline: true},

            {name: "Bed Broken", value: `${s.bedbroken}`, inline: true},
            {name: "Bed Lost", value: `${s.bedlost}`, inline: true},
            {name: `${process.env.BED_EMOJI} | BBLR`, value: `${bblr}`, inline: true}
        );
    } else if (type === "void") {
        const vkdr = ratio(s.vkills, s.vdeaths);
        const vfkdr = ratio(s.vfinalKills, s.vfinalDeaths);

        emb = emb.addFields(
            { name: "Void Kills", value: `${s.vkills}`, inline: true },
            { name: "Void Deaths", value: `${s.vdeaths}`, inline: true },
            { name: `${process.env.KILL_EMOJI} | Void KDR ${process.env.VOID_EMOJI}`, value: `${vkdr}`, inline: true },

            { name: "Void Final Kills", value: `${s.vfinalKills}`, inline: true },
            { name: "Void Final Deaths", value: `${s.vfinalDeaths}`, inline: true },
            { name: `${process.env.FINAL_KILL_EMOJI} | Void FKDR ${process.env.VOID_EMOJI}`, value: `${vfkdr}`, inline: true },
        )
    }

    emb = emb
        .addFields(
            { name: `${process.env.CLOCK_EMOJI} Last Fetch: <t:${Math.floor( now/ 1000)}:R>`, value: `\u200B`, inline: false },
        )
        .setFooter({
            text:"made by mtnk | @unsnipeable"
        });

    return emb;
}


function ratio(a, b) {
    a = a ?? 0;
    b = b ?? 0;
    return b === 0 ? a : (a / b).toFixed(2);
}

module.exports = {
    buildEmbed
};