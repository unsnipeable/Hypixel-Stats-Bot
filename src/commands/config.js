const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

const fs = require("fs");
const path = require("path");

const {setKey} = require("../api/hypixel");

const premiumFilePath = path.join(__dirname, "../data/premium.json");
let premium;

module.exports = {
    data: new SlashCommandBuilder()
        .setName("config")
        .setDescription("Admins only")
        .addStringOption(option =>
            option
                .setName("action")
                .setDescription("Action")
                .setRequired(true)
                .addChoices(
                    { name: 'Update Hypixel API-Key', value: 'apikey' },
                    { name: 'Add Admin', value: 'add_admin' },
                    { name: 'Remove Admin', value: 'rm_admin' },
                    { name: 'Show list of Admin', value: 'ls_admin' }
                )
        )
        .addStringOption(option =>
            option
                .setName("value")
                .setDescription("Value")
                .setRequired(false)
        ),

    async execute(interaction) {
        premium = JSON.parse(
            fs.readFileSync(premiumFilePath, "utf8")
        );
        const admins = premium.admins || [];

        if (!admins.includes(interaction.user.id)) {
            return interaction.reply({
                content: "Admin only",
                ephemeral: true
            });
        }

        const action = interaction.options.getString("action");
        await interaction.deferReply({ephemeral: true});
        let embed;

        if (action === "apikey") {
            const envPath = path.join(__dirname, "../../.env");
            let env = fs.readFileSync(envPath, "utf8");
            const value = interaction.options.getString("value");
            env = env.replace(/^HYPIXEL_API=.*/m, `HYPIXEL_API=${value}`);

            fs.writeFileSync(envPath, env);

            setKey(value);

            embed = new EmbedBuilder().setDescription(`Updated Hypixel API to ||\`\`\`${value}\`\`\`||`);
        } else if (action === "add_admin") {
            const value = interaction.options.getString("value");
            addAdmin(value);
            embed = new EmbedBuilder().setDescription(`# :partying_face: <@${value}> has been promoted to admin! :partying_face:`);
        } else if (action === "rm_admin") {
            const value = interaction.options.getString("value");
            removeAdmin(value);
            embed = new EmbedBuilder().setDescription(`# :cry: <@${value}> has been demoted from admin :cry:`);
        } else if (action === "ls_admin") {
            embed = new EmbedBuilder().setDescription(
                `# Current Admin:\n${
                    admins.length
                        ? admins.map(id => `<@${id}> - ${id}`).join("\n")
                        : "None"
                }`);
        }

        await interaction.editReply({
            embeds: [embed]
        });
    }
};

function addAdmin(id) {
    const data = load();

    if (!data.admins.includes(id)) {
        data.admins.push(id);
        save(data);
        return true;
    }

    return false;
}

function removeAdmin(id) {
    const data = load();

    const before = data.admins.length;
    data.admins = data.admins.filter(a => a !== id);

    if (data.admins.length !== before) {
        save(data);
        return true;
    }

    return false;
}

function load() {
    return JSON.parse(fs.readFileSync(premiumFilePath, "utf-8"));
}

function save(data) {
    fs.writeFileSync(premiumFilePath, JSON.stringify(data, null, 2));
}