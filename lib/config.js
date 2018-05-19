import path from "path";

export default {
    scheme: process.env.NEUTRON_SCHEME || "http",
    host: process.env.NEUTRON_HOST || "localhost",
    public_port: process.env.NEUTRON_PORT || 8080,
    private_port: process.env.PORT || process.env.NEUTRON_PORT || 8080,
    pid: process.env.NEUTRON_PID_FILE || null,
    admin_token: process.env.NEUTRON_ADMIN_TOKEN || "T3sT111",
    storage: process.env.NEUTRON_STORAGE || "azure",
    local: {
        directory: process.env.NEUTRON_STORAGE_LOCAL_DIRECTORY || path.join(__dirname, "..", "updates")
    },
    azure: {
        account: process.env.NEUTRON_STORAGE_AZURE_ACCOUNT || "azure",
        key: process.env.NEUTRON_STORAGE_AZURE_KEY || "key"
    },
    amazon: {
        key: process.env.NEUTRON_STORAGE_AMAZON_KEY || "themagickey",
        secret: process.env.NEUTRON_STORAGE_AMAZON_SECRET || "notsosecret",
        region: process.env.NEUTRON_STORAGE_AMAZON_REGION || "us-west-2"
    },
    github: {
        token: process.env.NEUTRON_STORAGE_GITHUB_TOKEN || "octoken",
        owner: process.env.NEUTRON_STORAGE_GITHUB_OWNER || "octocat",
        repositories: JSON.parse(process.env.NEUTRON_STORAGE_GITHUB_REPOSITORIES || "[]")
    },
    openstack: {
        username: process.env.NEUTRON_STORAGE_OPENSTACK_USERNAME || "open",
        password: process.env.NEUTRON_STORAGE_OPENSTACK_PASSWORD || "stack",
        auth_url: process.env.NEUTRON_STORAGE_OPENSTACK_AUTH_URL || null,
        region: process.env.NEUTRON_STORAGE_OPENSTACK_REGION || null
    }
};
