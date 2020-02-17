import { Guild, Role, GuildChannel, GuildMember, TextChannel, Client } from "discord.js";
import RoleColors from "./role-colors";
import Release from "./releases/release";

function notifyRelease(client: Client, message: string): void {
    client.guilds.array().forEach(g => {
        let c = g.channels.find(c => c.name === 'chapter_not_read');
        if (c.type === 'text') {
            (c as TextChannel).send(message);
        }
    });
}

async function setupReleaseNotifier(client: Client, release: Release) {
    setInterval(async () => {
        let date = new Date();
        if (
            release.day === date.getDay() &&
            release.hour === date.getHours() + 1 &&
            release.minutes === date.getMinutes()
        ) {
            await setupAllGuildsOfBot(client);
            notifyRelease(client, release.message);
        }
    }, release.checkIntervalSeconds * 1000)

}

async function setupAllGuildsOfBot(client: Client) {
    client.guilds.array().forEach(setupGuild);
}

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

export { setupGuild, setupReleaseNotifier, setRead, setNotRead };