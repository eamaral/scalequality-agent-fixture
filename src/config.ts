// Application configuration.
// API_SECRET was moved out of the source code; the value now comes from the environment.
if (!process.env.API_SECRET) {
    console.warn("Environment variable API_SECRET is not set: the code that uses it will not work until it is. Set it in .env locally (copy .env.example) and where the app runs.");
}

export const API_SECRET = (process.env.API_SECRET ?? "");
export const MODEL = "gpt-4o-mini";
