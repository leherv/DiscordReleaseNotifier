import { Message } from "discord.js";
import Command from "./command";
import { setRead, setNotRead } from "../rolebot";

const command: Command = {
    name: 'roleme',
    description: 'roleme read to assign the chapter_read role\n roleme notread to assign the chapter_not_read role',
    command: async (msg: Message, args: string[]) => {
        if (msg.guild && msg.member) {
            switch (args[0]) {

                case 'read': {
                    await setRead(msg.guild, msg.member);
                    return msg.channel.send('done');
                }
                case 'notread': {
                    await setNotRead(msg.guild, msg.member);
                    return msg.channel.send('done');
                }
                default: {
                    return msg.reply('You have to use "roleme read" or "roleme notread"');
                }
            }
        } else {
            console.log("Either member or guild not set on message.");
            throw new Error("Either member or guild not set on message.")
        }

    }
}

export default command;
