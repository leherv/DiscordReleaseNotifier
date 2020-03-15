import Days from "./days";

type Release = {
    name: string,
    message: string,
    day: Days,
    hour: number,
    minutes: number,
    latestChapter: number,
    scrapeTask: {
        url: string,
        message: string
    }
}

export default Release;
