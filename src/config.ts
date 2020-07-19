type Config = {
    token: string,
    prefix: string
};

const config: Config = {
    token: process.env['BOT_TOKEN'] ?? '',
    prefix: '!'
};

export default config;