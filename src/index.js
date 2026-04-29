require("dotenv").config();

const { Client, GatewayIntentBits, ActivityType} = require("discord.js");
const fs = require("fs");
const path = require("path");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers
    ]
});

client.commands = new Map();

const commandFiles = fs
    .readdirSync(path.join(__dirname, "commands"))
    .filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}

const eventFiles = fs
    .readdirSync(path.join(__dirname, "events"))
    .filter(file => file.endsWith(".js"));

for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    event(client);
}

client.once("ready", () => {
    console.log(`Logged in as ${client.user.tag}`);

    let t;
    setInterval(() => {
        t = !t;
        if (t) {
            client.user.setActivity({
                name: 'bedwars',
                type: ActivityType.Playing
            });
        } else {
            client.user.setActivity({
                name: 'Try /bedwars <player>!',
                type: ActivityType.Custom
            });
        }
    }, 10000)
});

client.login(process.env.DISCORD_TOKEN);