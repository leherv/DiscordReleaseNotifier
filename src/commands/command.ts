import { Message } from "discord.js";

type Command = {
    name: string,
    description: string,
    command: (msg: Message, args: string[]) => Promise<Message[] | Message>
}

export default Command;