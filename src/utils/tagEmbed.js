const {EmbedBuilder} = require("discord.js");
const {get} = require("axios");

async function embedTag(name) {
    const url = `https://urchin.ws/player/${name}`;
    const { data } = await get(url);

    const tag = data.tags?.[0];

    if (!tag) {
        return new EmbedBuilder()
            .setDescription(`\`${name}\` is not in the blacklist.`);
    }

    const unix = Math.floor(new Date(tag.added_on).getTime() / 1000);

    return new EmbedBuilder()
        .setDescription(
            `Type: \`\`${tag.type}\`\`
            Reason: \`\`${tag.reason}\`\`
            Added: <t:${unix}:F>`
        ).setFooter({text: "urchin @hexze"})
}


module.exports = {
    embedTag
};