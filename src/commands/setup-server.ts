import { Message } from "discord.js";
import Command from "./command";
import { setupGuild } from "../rolebot";

const command: Command = {
    name: 'setupserver',
    description: 'Sets up roles and channels for the guild.',
    command: async (msg: Message, _args: string[]) => {
        if (msg.guild) {
            try {
                await setupGuild(msg.guild);
                return msg.channel.send('Setup complete.');
            } catch (e) {
                throw e;
            }
        } else {
            console.log("Guild not set on message.");
            throw new Error("Guild not set on message.");
        }
    }
}

export default command;
