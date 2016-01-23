import path from "path";

export default {
    updates: process.env.UPDATER_DIRECTORY || path.join(__dirname, "..", "updates"),
    scheme: process.env.UPDATER_SCHEME || "http",
    host: process.env.UPDATER_HOST || "localhost",
    port: process.env.UPDATER_PORT || process.env.PORT || 8080
}
