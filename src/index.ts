import { Client, Message } from 'discord.js';
import config from './config';
import commands from './commands/commands';
import { notifyRelease } from './rolebot';

const bot = new Client();

bot.once('ready', (_: any) => {
    console.log('Bot ready');
    // notifyRelease(bot);
});


bot.on('message', (msg: Message) => {
    const prefix = config.prefix;

    if (!msg.content.startsWith(prefix) || msg.author.bot) return; // ignore all others

    const args = msg.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift()?.toLowerCase();

    if (commandName) {
        if (commands.has(commandName)) {
            commands.get(commandName)?.command(msg, args);
        }
    }
});

bot.login(config.token);