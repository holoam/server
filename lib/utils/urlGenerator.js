export default class UrlGenerator {
    constructor(baseUrl, router) {
        this.baseUrl = baseUrl;
        this.router = router;
    }

    generateDownloadReleaseUrl(app, release) {
        return `${this.baseUrl}${this.router.url("api-v1-release-download", { app: app.name, version: release.version })}`;
    }
}
