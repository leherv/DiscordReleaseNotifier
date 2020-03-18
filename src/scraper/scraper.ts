import puppeteer from "puppeteer";
import { ScrapingResult, scrapingFailure } from "./scrapingResult";

async function fetchScrapingResult(url: string): Promise<ScrapingResult> {
    switch (url) {
        case 'https://jaiminisbox.com/reader/series/solo-leveling': {
            return fetchSLScrapingResult();
        }
        default: {
            return scrapingFailure();
        }
    }
}


async function fetchSLScrapingResult(): Promise<ScrapingResult> {
    try {
        const browser = await puppeteer.launch({
            executablePath: '/usr/bin/chromium-browser',
            args: ['--no-sandbox']
        });
        const page = await browser.newPage();
        await page.goto('https://jaiminisbox.com/reader/series/solo-leveling');
        await page.waitForSelector('div.group', { timeout: 5000 });

        const result = await page.evaluate(() => {
            const divGroup = document.querySelector('div.group');
            if (divGroup?.hasChildNodes) {
                const newestElement = divGroup.querySelector('div.element');
                if (newestElement?.hasChildNodes) {
                    const newestTitle = newestElement.querySelector('div.title');
                    if (newestTitle?.hasChildNodes) {
                        const newestLink = newestTitle.querySelector('a');
                        if (newestLink) {
                            const chapter = newestLink.innerHTML.match('\\d\\d\\d');
                            if (!chapter) return scrapingFailure();
                            const chapterNumber = parseInt(chapter[0].trim());
                            return {
                                success: true,
                                chapter: chapterNumber,
                                href: newestLink.href
                            };
                        }
                    }
                }
            }
            return scrapingFailure();
        });
        return result;
    } catch (e) {
        console.log("Scraping failed.", e);
        return scrapingFailure();
    }
}


export { fetchScrapingResult }