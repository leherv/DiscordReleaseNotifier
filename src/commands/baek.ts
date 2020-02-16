import { Message } from "discord.js";
import Command from './command';

const command: Command = {
    name: 'baek',
    description: '',
    command: (msg: Message, _args: string[]) => {
        msg.channel.send('tiger dude');
    }
}

export default command;