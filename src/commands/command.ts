import { Message } from "discord.js";

type Command = {
    name: string,
    description: string,
    command: (msg: Message, args: string[]) => void
}

export default Command;