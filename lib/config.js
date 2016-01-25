import path from "path";

export default {
    scheme: process.env.UPDATER_SCHEME || "http",
    host: process.env.UPDATER_HOST || "localhost",
    port: process.env.UPDATER_PORT || process.env.PORT || 8080,
    storage: process.env.UPDATER_STORAGE || "local",
    local: {
        directory: process.env.UPDATER_STORAGE_LOCAL_DIRECTORY || path.join(__dirname, "..", "updates")
    },
    azure: {
        account: process.env.UPDATER_STORAGE_AZURE_ACCOUNT || "account",
        key: process.env.UPDATER_STORAGE_AZURE_KEY || "thelagickey"
    }
}
