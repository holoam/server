class UrlGenerator {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }

    generateDownloadReleaseUrl(app, release) {
        return `${this.baseUrl}/${app.name}/${release.version}/update`;
    }
}

export default UrlGenerator;