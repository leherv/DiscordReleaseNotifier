* DiscordReleaseNotifier

** Setup
Replace "example.env" with a real ".env" file and supply a value for "BOT_TOKEN"
Supply data for the scraping-targets in "releaseScrapingTasks.json"
Supply a method in "scraper.ts" that extracts the correct values for the new target
Run docker-compose build & docker-compose run