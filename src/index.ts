import { Client } from 'discord.js';
import token from "./token";

const bot = new Client();

bot.on('ready', _ => {
    console.log('Bot ready');
});

bot.on('message', async msg => {
    switch (msg.content) {
        case 'sungjinwoo': {
            msg.reply('<3');
            break;
        }
        case 'chahaein': {
            msg.reply('waifu');
            break;
        }
        case 'baek': {
            msg.reply('tigerdude');
            break;
        }
        case 'viktor': {
            msg.reply('my godfather');
            break;
        }
    }
})

bot.login(token);