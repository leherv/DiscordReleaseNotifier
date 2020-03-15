import Release from "./release";
import fs from "fs";

function loadReleases(): Promise<Release[]> {
    return new Promise((resolve, reject) => {
        fs.readFile('./releases.json', 'utf8', (err, contents) => {
            if (err) reject(err.message);
            resolve(JSON.parse(contents));
        });
    })
}

function saveReleases(releases: Release[]) {
    return new Promise((resolve, reject) => {
        fs.writeFile('./releases.json', JSON.stringify(releases), (err) => {
            if (err) reject(err.message);
            resolve();
        })
    })
}

export { loadReleases, saveReleases };