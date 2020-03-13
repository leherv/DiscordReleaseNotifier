import { Message } from "discord.js";
import commands from './commands';
import Command from "./command";

const command: Command = {
    name: 'help',
    description: 'Prints all available commands.',
    command: (msg: Message, _args: string[]) => {
        let help: string = '';
        commands.forEach(command => {
            help += `!${command.name} ${command.description === '' ? '' : `- ${command.description}`}\n`
        });
        return msg.channel.send(help);
    }
}

export default command;
