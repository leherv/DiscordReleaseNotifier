import { Client, Message } from 'discord.js';
// create a copy of example.config.ts and call it config.ts - also put your token in
import config from './config';
import commands from './commands/commands';
import { setupGuild, sendMessage } from './rolebot';
import { loadReleaseScrapingTasks, saveReleaseScrapingTasks } from './releases/releaseScrapingTasks';
import ReleaseScrapingTask from './releases/releaseScrapingTask';
import { fetchScrapingResult } from './scraper/scraper';

const bot = new Client();

bot.once('ready', async (_: any) => {
    try {
        console.log('Loading releases...');
        const releases: ReleaseScrapingTask[] = await loadReleaseScrapingTasks();
        console.log('Bot ready');

        while (1) {
            let saveNeeded = false;
            // scraping Tasks (we do not use Promise.all because that would be all or nothing!)
            for (let release of releases) {
                try {
                    const scrapeResult = await fetchScrapingResult(release.scrapeTask.url)
                    if (scrapeResult.success) {
                        if (scrapeResult.chapter > release.latestChapter) {
                            release.latestChapter++;
                            saveNeeded = true;
                            const message = (release?.scrapeTask?.message ?? "New Chapter: ") + scrapeResult.href;
                            await Promise.all(bot.guilds.cache.map(g => setupGuild(g)));
                            await sendMessage(message, bot);
                        }
                    }
                } catch (e) {
                    console.log(`Scraping for new release failed for url: ${release.scrapeTask.url}.`, e);
                }
            }

            if (saveNeeded) {
                try {
                    await saveReleaseScrapingTasks(releases);
                } catch (e) {
                    console.log("Saving updated release info failed", e);
                    process.exit();
                }
            }
            setTimeout(() => { }, 3600000);
        }
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