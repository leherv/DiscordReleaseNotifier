import { Client, Message, TextChannel } from 'discord.js';
// create a copy of example.config.ts and call it config.ts - also put your token in
import config from './config';
import commands from './commands/commands';
import { setupGuild, sendReleaseMessage } from './rolebot';
import loadReleases from './releases/releases';
import Release from './releases/release';

const bot = new Client();

bot.once('ready', async (_: any) => {
    try {
        console.log('Loading releases...');
        const releases: Release[] = await loadReleases();
        console.log('Bot ready');
        setInterval(async () => {
            try {
                const date = new Date();
                console.log(date.getDay());
                console.log(date.getHours());
                console.log(date.getMinutes());
                // identify what to release
                console.log(releases);
                const toRelease = releases.filter(release => release.minutes === date.getMinutes() && release.hour === date.getHours() && release.day === date.getDay());
                console.log(toRelease);
                if (toRelease.length <= 0) return;

                // setup all guilds
                await Promise.all(bot.guilds.cache.map(g => setupGuild(g)));
                // send each release message to each guild
                await Promise.all(toRelease.map(release => sendReleaseMessage(release, bot)));

            } catch (e) {
                console.log('Setting up for releases failed. Exiting...', e);
                process.exit();
            }
        }, 60000)
    } catch (e) {
        console.log('Loading releases failed. Exiting...', e);
        process.exit();
    }
});


bot.on('message', async (msg: Message) => {
    const prefix = config.prefix;

    if (!msg.content.startsWith(prefix) || msg.author.bot) return; // ignore all others

    const args = msg.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift()?.toLowerCase();

    if (commandName) {
        if (commands.has(commandName)) {
            try {
                await commands.get(commandName)?.command(msg, args);
            } catch (e) {
                console.log(`Executing command ${commandName} failed. \nReason:`, e);
                msg.channel.send('Something went wrong.');
            }
        }
    }
});

bot.login(config.token);