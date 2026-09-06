// Application configuration.
// API_SECRET was moved out of the source code; the value now comes from the environment.
if (!process.env.API_SECRET) {
    throw new Error("Missing environment variable API_SECRET. Copy .env.example to .env and set it, or set it where the app runs.");
}

export const API_SECRET = process.env.API_SECRET;
export const MODEL = "gpt-4o-mini";
