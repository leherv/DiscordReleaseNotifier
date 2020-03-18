import { Client, Message } from 'discord.js';
// create a copy of example.config.ts and call it config.ts - also put your token in
import config from './config';
import commands from './commands/commands';
import { setupGuild, sendMessage } from './rolebot';
import { loadReleases, saveReleases } from './releases/releases';
import Release from './releases/release';
import { fetchScrapingResult } from './scraper/scraper';

const bot = new Client();

bot.once('ready', async (_: any) => {
    try {
        console.log('Loading releases...');
        const releases: Release[] = await loadReleases();
        console.log('Bot ready');
        // resets after 10 min
        let minutesPassed = 0;
        // every minute
        setInterval(async () => {
            const date = new Date();
            let saveNeeded = false;
            minutesPassed++;
            minutesPassed %= 10;

            // release message
            try {
                // identify what to release
                const toRelease = releases.filter(release => release.minutes === date.getMinutes() && release.hour === date.getHours() && release.day === date.getDay());
                if (toRelease.length > 0) {
                    // setup all guilds
                    await Promise.all(bot.guilds.cache.map(g => setupGuild(g)));
                    // send each release message to each guild
                    await Promise.all(toRelease.map(release => sendMessage(release.message, bot)));
                };
            } catch (e) {
                console.log('Setting up for releases failed. Exiting...', e);
                process.exit();
            }

            // scraping Tasks (we do not use Promise.all because it is all or nothing!)
            if (minutesPassed == 0) {
                for (let release of releases) {
                    try {
                        const scrapeResult = await fetchScrapingResult(release.scrapeTask.url)
                        if (scrapeResult.success) {
                            if (scrapeResult.chapter > release.latestChapter) {
                                release.latestChapter++;
                                saveNeeded = true;
                                await Promise.all(bot.guilds.cache.map(g => setupGuild(g)));
                                await sendMessage(release.scrapeTask.message + scrapeResult.href, bot);
                            }
                        }
                    } catch (e) {
                        console.log(`Scraping for new release failed for url: ${release.scrapeTask.url}.`, e);
                    }
                }
            }

            if (saveNeeded) {
                try {
                    await saveReleases(releases);
                } catch (e) {
                    console.log("Saving updated release info failed");
                    process.exit();
                }
            }
        }, 60000)
    } catch (e) {
        console.log('Loading releases failed. Exiting...', e);
        process.exit();
    }
});


bot.on('message', async (msg: Message) => {
    const prefix = config.prefix;

    if (!msg.content.startsWith(prefix) || msg.author.bot) return; // ignore all others

    const args = msg.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift()?.toLowerCase();

    if (commandName) {
        if (commands.has(commandName)) {
            try {
                await commands.get(commandName)?.command(msg, args);
            } catch (e) {
                console.log(`Executing command ${commandName} failed. \nReason:`, e);
                msg.channel.send('Something went wrong.');
            }
        }
    }
});

bot.login(config.token);