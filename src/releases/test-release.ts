import Release from "./release";
import Days from "./days";

const testRelease: Release = {
    day: Days.Sunday,
    hour: 22,
    minutes: 47,
    message: "THIS IS A TEST DO NOT PANIC!",
    name: "Test Release",
    checkIntervalSeconds: 60
}

export default testRelease;