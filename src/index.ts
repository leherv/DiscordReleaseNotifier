import { Client, Message } from 'discord.js';
// create a copy of example.config.ts and call it config.ts - also put your token in
import config from './config';
import commands from './commands/commands';
import { setupReleaseNotifier } from './rolebot';
import loadReleases from './releases/releases';

const bot = new Client();

bot.once('ready', async (_: any) => {
    try {
        console.log('Setting up releases...');
        const releases = await loadReleases();
        Promise.all(releases.map(async r => await setupReleaseNotifier(bot, r)));
        console.log('Bot ready');
    } catch (e) {
        console.log('Setting up releases failed. Exiting...');
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