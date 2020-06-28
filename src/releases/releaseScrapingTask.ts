type ReleaseScrapingTask = {
    name: string,
    latestChapter: number,
    scrapeTask: {
        url: string,
        message: string
    }
}

export default ReleaseScrapingTask;
