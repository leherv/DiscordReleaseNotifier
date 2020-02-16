import Release from "./release";
import soloLeveling from "./solo-leveling";
// import testRelease from "./test-release";

const releases: Map<string, Release> = new Map<string, Release>();
releases.set(soloLeveling.name, soloLeveling);
// releases.set(testRelease.name, testRelease);

export default releases;