import { Guild, Role, GuildChannel, GuildMember, TextChannel, CategoryChannel, OverwriteResolvable } from "discord.js";
import RoleColors from "./role-colors";
import ChannelTypes from "./channelTypes";

async function setupGuild(g: Guild) {
    const data = await Promise.all([
        getOrCreateRole(g, 'chapter_read', RoleColors.DARK_PURPLE, true),
        getOrCreateRole(g, 'chapter_not_read', RoleColors.BLUE, true),
        getOrCreateChannelOnGuild(g, 'Textkanäle', ChannelTypes.CATEGORY)
    ]);
    let chapterReadRole = data[0];
    let chapterNotReadRole = data[1];
    let parentChannel = (data[2] as CategoryChannel);
    return Promise.all([
        getOrCreateChannelOnGuild(g, 'chapter_read', ChannelTypes.TEXT, parentChannel, [
            {
                id: g.id,
                deny: "VIEW_CHANNEL"
            },
            {
                id: chapterReadRole.id,
                allow: "VIEW_CHANNEL"
            }
        ]),
        getOrCreateChannelOnGuild(g, 'chapter_not_read', ChannelTypes.TEXT, parentChannel, [
            {
                id: g.id,
                deny: "VIEW_CHANNEL"
            },
            {
                id: chapterNotReadRole.id,
                allow: "VIEW_CHANNEL"
            },
            {
                id: chapterReadRole.id,
                allow: "VIEW_CHANNEL"
            }
        ]),
        Promise.all(g.members.cache.map(m => manageRoles(m, [chapterNotReadRole], [chapterReadRole])))
    ]);
}

async function getOrCreateRole(g: Guild, name: string, color: RoleColors, mentionable: boolean): Promise<Role> {
    let role: Role | undefined = g.roles.cache.find(r => r.name === name);
    if (role) return role;
    return g.roles.create({
        data: {
            name: name,
            color: color,
            mentionable: mentionable
        }
    });
}

async function getOrCreateChannelOnGuild(g: Guild, name: string, channelType: ChannelTypes, parent?: GuildChannel, permissionOverwrites?: Array<OverwriteResolvable>): Promise<GuildChannel> {
    let channel: GuildChannel | undefined = g.channels.cache.find(c => c.name === name);
    if (channel) return channel;
    return g.channels.create(name, {
        type: channelType,
        permissionOverwrites: permissionOverwrites,
        parent: parent
    });
}

async function manageRoles(m: GuildMember, rolesToAdd: Role[], rolesToRemove: Role[]) {
    if (!m.user.bot) {
        await m.roles.add(rolesToAdd);
        await m.roles.remove(rolesToRemove);
    }
}

async function setRead(g: Guild, m: GuildMember) {
    let chapterReadRole = await getOrCreateRole(g, 'chapter_read', RoleColors.DARK_PURPLE, true);
    let chapterNotReadRole = await getOrCreateRole(g, 'chapter_not_read', RoleColors.BLUE, true);
    return manageRoles(m, [chapterReadRole], [chapterNotReadRole]);
}

async function setNotRead(g: Guild, m: GuildMember) {
    let chapterReadRole = await getOrCreateRole(g, 'chapter_read', RoleColors.DARK_PURPLE, true);
    let chapterNotReadRole = await getOrCreateRole(g, 'chapter_not_read', RoleColors.BLUE, true);
    return manageRoles(m, [chapterNotReadRole], [chapterReadRole]);
}

export { setupGuild, setRead, setNotRead };