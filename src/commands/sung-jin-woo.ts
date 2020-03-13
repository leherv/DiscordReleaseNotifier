import { Message } from "discord.js";
import Command from './command';

const command: Command = {
    name: 'sungjinwoo',
    description: '',
    command: (msg: Message, _args: string[]) => {
        return msg.channel.send('<3');
    }
}

export default command;
