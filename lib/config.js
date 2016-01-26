import path from "path";

export default {
    scheme: process.env.NEUTRON_SCHEME || "http",
    host: process.env.NEUTRON_HOST || "localhost",
    public_port: process.env.NEUTRON_PORT || 8080,
    private_port: process.env.PORT || process.env.NEUTRON_PORT || 8080,
    storage: process.env.NEUTRON_STORAGE || "local",
    pid: process.env.NEUTRON_PID_FILE || null,
    local: {
        directory: process.env.NEUTRON_STORAGE_LOCAL_DIRECTORY || path.join(__dirname, "..", "updates")
    },
    azure: {
        account: process.env.NEUTRON_STORAGE_AZURE_ACCOUNT || "account",
        key: process.env.NEUTRON_STORAGE_AZURE_KEY || "thelagickey"
    }
}
