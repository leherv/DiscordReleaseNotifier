import { Message } from "discord.js";
import Command from "./command";
import { setRead, setNotRead } from "../rolebot";

const command: Command = {
    name: 'roleme',
    description: 'roleme read to assign the chapter_read role\n roleme notread to assign the chapter_not_read role',
    command: async (msg: Message, args: string[]) => {
        switch (args[0]) {
            case 'read': {
                await setRead(msg.guild, msg.member);
                break;
            }
            case 'notread': {
                await setNotRead(msg.guild, msg.member);
                break;
            }
            default: {
                msg.reply('You have to use "roleme read" or "roleme notread"');
            }
        }
    }
}

export default command;
