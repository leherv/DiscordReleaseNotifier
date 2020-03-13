import { Guild, Role, GuildChannel, GuildMember, TextChannel, Client, CategoryChannel } from "discord.js";
import RoleColors from "./role-colors";
import Release from "./releases/release";
import ChannelTypes from "./channelTypes";

function notifyRelease(client: Client, message: string): void {
    client.guilds.cache.forEach(g => {
        let c = g.channels.cache.find(c => c.name === 'chapter_not_read');
        if (c !== undefined && c.type === 'text') {
            try {
                (c as TextChannel).send(message);
            } catch (e) {
                console.log('Could not send release-message', e);
            }
        }
    });
}

async function setupReleaseNotifier(client: Client, release: Release): Promise<void> {
    setInterval(async () => {
        let date = new Date();
        if (
            release.day === date.getDay() &&
            release.hour === date.getHours() + 1 &&
            release.minutes === date.getMinutes()
        ) {
            try {
                await setupAllGuildsOfBot(client);
                notifyRelease(client, release.message);
            } catch (e) {
                console.log('Could not setup release-notifier - exiting... \nReason:', e);
                process.exit();
            }
        }
    }, release.checkIntervalSeconds * 1000)
}

async function setupAllGuildsOfBot(client: Client) {
    return Promise.all(client.guilds.cache.map(g => setupGuild(g)));
}

async function setupGuild(g: Guild) {
    const data = await Promise.all([
        getOrCreateRole(g, 'chapter_read', RoleColors.DARK_PURPLE, true),
        getOrCreateRole(g, 'chapter_not_read', RoleColors.BLUE, true),
        getOrCreateChannelOnGuild(g, 'chapter_read', ChannelTypes.TEXT),
        getOrCreateChannelOnGuild(g, 'chapter_not_read', ChannelTypes.TEXT),
        getOrCreateChannelOnGuild(g, 'Textkanäle', ChannelTypes.CATEGORY)
    ]);
    let chapterReadRole = data[0];
    let chapterNotReadRole = data[1];
    let chapterReadChannel = (data[2] as TextChannel);
    let chapterNotReadChannel = (data[3] as TextChannel);
    let parentChannel = (data[4] as CategoryChannel);
    return Promise.all([
        chapterReadChannel.setParent(parentChannel),
        chapterNotReadChannel.setParent(parentChannel),
        chapterNotReadChannel.overwritePermissions([
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
        chapterReadChannel.overwritePermissions([
            {
                id: g.id,
                deny: "VIEW_CHANNEL"
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

async function getOrCreateChannelOnGuild(g: Guild, name: string, channelType: ChannelTypes): Promise<GuildChannel> {
    let channel: GuildChannel | undefined = g.channels.cache.find(c => c.name === name);
    if (channel) return channel;
    return g.channels.create(name, { type: channelType });
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

export { setupGuild, setupReleaseNotifier, setRead, setNotRead };