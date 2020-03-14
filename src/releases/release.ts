import Days from "./days";

type Release = {
    message: string,
    name: string,
    day: Days,
    hour: number,
    minutes: number
}

export default Release;
