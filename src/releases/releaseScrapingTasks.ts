import ReleaseScrapingTask from "./releaseScrapingTask";
import fs from "fs";

const fileName = "releaseScrapingTasks.json";

function loadReleaseScrapingTasks(): Promise<ReleaseScrapingTask[]> {
    return new Promise((resolve, reject) => {
        fs.readFile(`./${fileName}`, 'utf8', (err, contents) => {
            if (err) reject(err.message);
            resolve(JSON.parse(contents));
        });
    })
}

function saveReleaseScrapingTasks(releases: ReleaseScrapingTask[]) {
    return new Promise((resolve, reject) => {
        fs.writeFile(`./${fileName}`, JSON.stringify(releases), (err) => {
            if (err) reject(err.message);
            resolve();
        })
    })
}

export { loadReleaseScrapingTasks, saveReleaseScrapingTasks };