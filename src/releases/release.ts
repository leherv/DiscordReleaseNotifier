import Days from "./days";

type Release = {
    message: string,
    name: string,
    day: Days,
    hour: number,
    minutes: number,
    checkIntervalSeconds: number
}

export default Release;
