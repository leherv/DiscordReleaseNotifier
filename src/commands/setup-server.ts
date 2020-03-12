import { Message } from "discord.js";
import Command from "./command";
import { setupGuild } from "../rolebot";

const command: Command = {
    name: 'setupserver',
    description: 'Sets up roles and channels for the guild.',
    command: async (msg: Message, _args: string[]) => {
        await setupGuild(msg.guild);
        msg.channel.send('Setup complete.');
    }
}

export default command;
