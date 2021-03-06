import { firefox, LaunchOptions } from "playwright-firefox";
import { ScrapingResult, scrapingFailure } from "./scrapingResult";

const launchOptions: LaunchOptions = {
    headless: true
}

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
    let browser = null;
    try {
        console.log("Started scraping");
        browser = await firefox.launch(launchOptions);
        const context = await browser.newContext();
        const page = await context.newPage();
        await page.goto('https://jaiminisbox.com/reader/series/solo-leveling');
        await page.waitForSelector('div.group');
        console.log("1");
        const result = await page.evaluate(() => {
            console.log("2");
            const divGroup = document.querySelector('div.group');
            if (divGroup?.hasChildNodes) {
                const newestElement = divGroup.querySelector('div.element');
                if (newestElement?.hasChildNodes) {
                    console.log("3");
                    const newestTitle = newestElement.querySelector('div.title');
                    if (newestTitle?.hasChildNodes) {
                        const newestLink = newestTitle.querySelector('a');
                        if (newestLink) {
                            console.log("4");
                            const chapter = newestLink.innerHTML.match('\\d\\d\\d');
                            console.log("5");
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
    } finally {
        await browser?.close();
    }
}


export { fetchScrapingResult }