type ScrapingResult = {
    success: boolean,
    chapter: number,
    href: string
}

function scrapingFailure(): ScrapingResult {
    return {
        success: false,
        chapter: -1,
        href: '',
    }
}

export { ScrapingResult, scrapingFailure };