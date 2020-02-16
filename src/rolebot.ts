import { Guild, Role, GuildChannel, GuildMember, TextChannel, Client } from "discord.js";
import RoleColors from "./role-colors";

// function getAllGuilds(client: Client): Guild[] {
//     return client.guilds.array();
// }

// function notifyRelease(client: Client): void {
//     client.guilds.array().forEach(g => {
//         const date = new Date();

//         if (date.getDay() === 3)

//             if (date.getDay() === 0) {
//                 let c = g.channels.find(c => c.name === 'chapter_not_read');
//                 if (c.type === 'text') {
//                     (c as TextChannel).send('NEW CHAPTER!!!!');
//                 }
//             }
//     });
// }


async function setupGuild(g: Guild): Promise<void> {
    let chapterReadRole = await getOrCreateRole(g, 'chapter_read', RoleColors.DARK_PURPLE, true);
    let chapterNotReadRole = await getOrCreateRole(g, 'chapter_not_read', RoleColors.BLUE, true);
    let everyoneRole = g.defaultRole;

    let chapterReadChannel = await getOrCreateTextChannelOnGuild(g, 'chapter_read');
    let chapterNotReadChannel = await getOrCreateTextChannelOnGuild(g, 'chapter_not_read');

    await chapterReadChannel.overwritePermissions(chapterReadRole, { 'VIEW_CHANNEL': true });
    await chapterReadChannel.overwritePermissions(everyoneRole, { 'VIEW_CHANNEL': false });

    await chapterNotReadChannel.overwritePermissions(chapterNotReadRole, { 'VIEW_CHANNEL': true });
    await chapterNotReadChannel.overwritePermissions(chapterReadRole, { 'VIEW_CHANNEL': true });
    await chapterNotReadChannel.overwritePermissions(everyoneRole, { 'VIEW_CHANNEL': false });

    g.members.forEach(async m => {
        manageRoles(m, [chapterNotReadRole], [chapterReadRole]);
    });
}

async function getOrCreateRole(g: Guild, name: string, color: RoleColors, mentionable: boolean): Promise<Role> {
    let role: Role | undefined = g.roles.find(r => r.name === name);
    if (role) return role;
    return g.createRole({
        name: name,
        color: color,
        mentionable: mentionable
    });
}

async function getOrCreateTextChannelOnGuild(g: Guild, name: string): Promise<GuildChannel> {
    let channel: GuildChannel | undefined = g.channels.find(c => c.name === name);
    if (channel) return channel;
    return g.createChannel(name, 'text');
}

async function manageRoles(m: GuildMember, rolesToAdd: Role[], rolesToRemove: Role[]) {
    if (!m.user.bot) {
        await m.addRoles(rolesToAdd);
        await m.removeRoles(rolesToRemove);
    }
}

async function setRead(g: Guild, m: GuildMember) {
    let chapterReadRole = await getOrCreateRole(g, 'chapter_read', RoleColors.DARK_PURPLE, true);
    let chapterNotReadRole = await getOrCreateRole(g, 'chapter_not_read', RoleColors.BLUE, true);
    manageRoles(m, [chapterReadRole], [chapterNotReadRole]);
}

async function setNotRead(g: Guild, m: GuildMember) {
    let chapterReadRole = await getOrCreateRole(g, 'chapter_read', RoleColors.DARK_PURPLE, true);
    let chapterNotReadRole = await getOrCreateRole(g, 'chapter_not_read', RoleColors.BLUE, true);
    manageRoles(m, [chapterNotReadRole], [chapterReadRole]);
}

export { setupGuild, setRead, setNotRead };