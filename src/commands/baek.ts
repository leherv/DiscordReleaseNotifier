import { Message } from "discord.js";
import Command from './command';

const command: Command = {
    name: 'baek',
    description: '',
    command: (msg: Message, _args: string[]) => {
        return msg.channel.send('tiger dude');
    }
}

export default command;