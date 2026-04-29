
const { fetchStats } = require("../api/hypixel");

const {
    buildEmbed
} = require("../utils/embed");

const {
    buildMenu,MODES
} = require("../utils/menus");
const {
    cache,
    CACHE_TIME,
} = require("../utils/cache");
const {EmbedBuilder} = require("discord.js");
const { embedTag} = require("../utils/tagEmbed");

module.exports = (client) => {

    client.on("interactionCreate", async interaction => {

        if (interaction.isButton()) {
            if (interaction.customId.includes(":")) {
                const username = interaction.customId.split(":")[2];

                if (interaction.customId.split(":")[0] === "btn_switch_statsbot") {
                    try {

                        let cached = cache.get(username).data;

                        let mode = interaction.customId.split(":")[1]

                        if (!cached || Date.now() - cached.time > CACHE_TIME) {

                            const stats = await fetchStats(username);

                            if (!stats) {
                                return interaction.reply({
                                    content: "Refetch failed",
                                    ephemeral: true
                                });
                            }

                            cache.set(username, {
                                stats,
                                time: Date.now()
                            });

                            cached = cache.get(username).data;
                        }

                        const embed =
                            buildEmbed(username, mode, cached, cache.get(username).time, "void");

                        const tag = await embedTag(username);
                        await interaction.update({
                            embeds: [embed, tag],
                            components: buildMenu(mode, "mode_select_statsbot_void:" + username)
                        });

                    } catch (err) {
                        console.error(err);

                        if (interaction.deferred || interaction.replied) {
                            await interaction.followUp({
                                embeds: [new EmbedBuilder().setTitle(`Expired ${process.env.BARRIER_EMOJI}`).setDescription("This embed has expired (too old).\nPlease try entering command again.").setColor(0xFF0000)],
                                ephemeral: true
                            });
                        } else {
                            await interaction.reply({
                                embeds: [new EmbedBuilder().setTitle(`Expired ${process.env.BARRIER_EMOJI}`).setDescription("This embed has expired (too old).\nPlease try entering command again.").setColor(0xFF0000)],
                                ephemeral: true
                            });
                        }
                    }
                } else if (interaction.customId.split(":")[0] === "btn_switch_statsbot_void") {

                    try {

                        let cached = cache.get(username).data;

                        let mode = interaction.customId.split(":")[1]
                        if (!cached || Date.now() - cached.time > CACHE_TIME) {

                            const stats = await fetchStats(username);

                            if (!stats) {
                                await interaction.reply({
                                    embeds: [new EmbedBuilder().setTitle(`Expired ${process.env.BARRIER_EMOJI}`).setDescription("This embed has expired (too old).\nPlease try entering command again.").setColor(0xFF0000)],
                                    ephemeral: true
                                });
                            }

                            cache.set(username, {
                                stats,
                                time: Date.now()
                            });

                            cached = cache.get(username).data;
                        }

                        const embed =
                            buildEmbed(username, mode, cached, cache.get(username).time);

                        const tag = await embedTag(username);
                        await interaction.update({
                            embeds: [embed, tag],
                            components: buildMenu(mode, "mode_select_statsbot:" + username)
                        });

                    } catch (err) {
                        console.error(err);

                        if (interaction.deferred || interaction.replied) {
                            await interaction.followUp({
                                embeds: [new EmbedBuilder().setTitle(`Expired ${process.env.BARRIER_EMOJI}`).setDescription("This embed has expired (too old).\nPlease try entering command again.").setColor(0xFF0000)],
                                ephemeral: true
                            });
                        } else {
                            await interaction.reply({
                                embeds: [new EmbedBuilder().setTitle(`Expired ${process.env.BARRIER_EMOJI}`).setDescription("This embed has expired (too old).\nPlease try entering command again.").setColor(0xFF0000)],
                                ephemeral: true
                            });
                        }
                    }
                }
            }
        } else if (interaction.isChatInputCommand()) {

            const command = client.commands.get(interaction.commandName);
            if (!command) return;

            try {
                await command.execute(interaction);
            } catch (err) {
                console.error(err);

                if (interaction.deferred || interaction.replied) {
                    await interaction.followUp({
                        content: "Error occurred",
                        ephemeral: true
                    });
                } else {
                    await interaction.reply({
                        content: "Error occurred",
                        ephemeral: true
                    });
                }
            }
        } else if (interaction.isStringSelectMenu()) {

            if (interaction.customId.includes(":")) {
                if (interaction.customId.split(":")[0] === "mode_select_statsbot") {

                    const mode = interaction.values[0];

                    const username = interaction.customId.split(":")[1]

                    try {

                        let cached = cache.get(username).data;

                        if (!cached || Date.now() - cached.time > CACHE_TIME) {

                            const stats = await fetchStats(username);

                            if (!stats) {
                                return interaction.reply({
                                    content: "Refetch failed",
                                    ephemeral: true
                                });
                            }

                            cache.set(username, {
                                stats,
                                time: Date.now()
                            });

                            cached = cache.get(username).data;
                        }

                        const embed =
                            buildEmbed(username, mode, cached, cache.get(username).time);

                        const tag = await embedTag(username);
                        await interaction.update({
                            embeds: [embed, tag],
                            components: buildMenu(mode, "mode_select_statsbot:" + username)
                        });

                    } catch (err) {
                        console.error(err);

                        if (interaction.deferred || interaction.replied) {
                            await interaction.followUp({
                                content: "Error",
                                ephemeral: true
                            });
                        } else {
                            await interaction.reply({
                                content: "Error",
                                ephemeral: true
                            });
                        }
                    }
                } else if (interaction.customId.split(":")[0] === "mode_select_statsbot_void") {

                    const mode = interaction.values[0];

                    const username = interaction.customId.split(":")[1]

                    try {

                        let cached = cache.get(username).data;

                        if (!cached || Date.now() - cached.time > CACHE_TIME) {

                            const stats = await fetchStats(username);

                            if (!stats) {
                                return interaction.reply({
                                    content: "Refetch failed",
                                    ephemeral: true
                                });
                            }

                            cache.set(username, {
                                stats,
                                time: Date.now()
                            });

                            cached = cache.get(username).data;
                        }

                        const embed =
                            buildEmbed(username, mode, cached, cache.get(username).time, "void");

                        const tag = await embedTag(username);
                        await interaction.update({
                            embeds: [embed, tag],
                            components: buildMenu(mode, "mode_select_statsbot_void:" + username)
                        });

                    } catch (err) {
                        console.error(err);

                        if (interaction.deferred || interaction.replied) {
                            await interaction.followUp({
                                embeds: [new EmbedBuilder().setTitle(`Expired ${process.env.BARRIER_EMOJI}`).setDescription("This embed has expired (too old).\nPlease try entering command again.").setColor(0xFF0000)],
                                ephemeral: true
                            });
                        } else {
                            await interaction.reply({
                                embeds: [new EmbedBuilder().setTitle(`Expired ${process.env.BARRIER_EMOJI}`).setDescription("This embed has expired (too old).\nPlease try entering command again.").setColor(0xFF0000)],
                                ephemeral: true
                            });
                        }
                    }
                }
            } else if (interaction.customId === "play_select_statsbot") {

                const mode = interaction.values[0];

                try {
                    const modes = ["rush", "lucky", "swap", "ultimate", "voidless", "underworld"];

                    let description;

                    if (mode === "four_four_totallynormal") {
                        description = `Commands for this mode no longer work.`;
                    } else if (modes.includes(mode)) {
                        description =
                            `## ${MODES[mode]} Mode commands\n` +
                            `\`\`\`/play bedwars_eight_two_${mode}\`\`\`\n` +
                            `\`\`\`/play bedwars_four_four_${mode}\`\`\``;
                    } else {
                        description =
                            `## ${MODES[mode]} Mode command\n` +
                            `\`\`\`/play bedwars_${mode}\`\`\``;
                    }

                    const embed = new EmbedBuilder()
                        .setDescription(description);

                    await interaction.update({
                        embeds: [embed],
                        components: buildMenu(mode, "play_select_statsbot")
                    });
                } catch (err) {
                    console.error(err);

                    if (interaction.deferred || interaction.replied) {
                        await interaction.followUp({
                            embeds: [new EmbedBuilder().setTitle(`Expired ${process.env.BARRIER_EMOJI}`).setDescription("This embed has expired (too old).\nPlease try entering command again.").setColor(0xFF0000)],
                            ephemeral: true
                        });
                    } else {
                        await interaction.reply({
                            embeds: [new EmbedBuilder().setTitle(`Expired ${process.env.BARRIER_EMOJI}`).setDescription("This embed has expired (too old).\nPlease try entering command again.").setColor(0xFF0000)],
                            ephemeral: true
                        });
                    }
                }
            }
        }

    });

};