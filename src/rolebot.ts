import { Guild, Role, GuildChannel, GuildMember, TextChannel, CategoryChannel, OverwriteResolvable, Client } from "discord.js";
import RoleColors from "./role-colors";
import ChannelTypes from "./channelTypes";

async function setupGuild(g: Guild) {
    const data = await Promise.all([
        getOrCreateRole(g, 'chapter_read', RoleColors.DARK_PURPLE, true),
        getOrCreateRole(g, 'chapter_not_read', RoleColors.BLUE, true),
        getOrCreateChannelOnGuild(g, 'Textkanäle', ChannelTypes.CATEGORY)
    ]);
    const chapterReadRole = data[0];
    const chapterNotReadRole = data[1];
    const parentChannel = (data[2] as CategoryChannel);
    const botRole = getBotRole(g)?.id
    const everyoneRole = g.roles.everyone?.id;
    if (!botRole || !everyoneRole) throw new Error('Something went wrong...');
    return Promise.all([
        getOrCreateChannelOnGuild(g, 'chapter_read', ChannelTypes.TEXT, parentChannel, [
            {
                id: everyoneRole,
                deny: "VIEW_CHANNEL"
            },
            {
                id: botRole,
                allow: "VIEW_CHANNEL"
            },
            {
                id: chapterReadRole.id,
                allow: "VIEW_CHANNEL"
            }
        ]),
        getOrCreateChannelOnGuild(g, 'chapter_not_read', ChannelTypes.TEXT, parentChannel, [
            {
                id: everyoneRole,
                deny: "VIEW_CHANNEL"
            },
            {
                id: botRole,
                allow: "VIEW_CHANNEL"
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

function getBotRole(g: Guild): Role | undefined {
    return g.roles.cache.find(r => r.name === 'rolebot');
}

function sendMessage(message: string, client: Client) {
    return Promise.all(client.guilds.cache.map(async g => {
        let c = g.channels.cache.find(c => c.name === 'chapter_not_read');
        if (c !== undefined && c.type === 'text') {
            var releaseChannel = (c as TextChannel);
            console.log(releaseChannel);
            await releaseChannel.send(message);
        }
    }));
}


export { setupGuild, setRead, setNotRead, sendMessage };