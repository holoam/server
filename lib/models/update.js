export class Update {
    constructor(app, release, url) {
        this.version = release.version;
        this.notes = release.notes;
        this.date = release.date;

        this.url = `${url}/${app.name}/${this.version}/update`;
    }
}
