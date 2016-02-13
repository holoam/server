export default class GithubReleaseDownloader {
    constructor(token, owner, repositories) {
        this.token = token;
        this.owner = owner;
        this.repositories = repositories;
    }

    async download(app, release, name) {
        return async ctx => {
            ctx.redirect(`https://github.com/${this.owner}/${app.name}/releases/download/${release.version}/${name}`);
        };
    }
}
