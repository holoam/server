var express = require('express'),
    morgan = require('morgan'),
    fs = require('fs'),
    path = require('path'),
    semver = require('semver'),
    moment = require('moment'),
    app = express(),
    updatesDir = process.env.UPDATER_DIRECTORY || path.join(__dirname, '/updates'),
    scheme = process.env.UPDATER_SCHEME || 'http',
    host = process.env.UPDATER_HOST || 'localhost',
    port = process.env.UPDATER_PORT || process.env.PORT || 80,
    findUpdates = function(dir) {
        return fs.readdirSync(dir)
            .filter(function(dir) {
                return semver.valid(dir);
            })
            .sort(function(a, b) {
                return semver.gt(a, b) ? 1 : -1;
            });
    },
    buildUrl = function(parts) {
        return scheme + '://' + host + ':' + port + '/' + parts.join('/');
    },
    buildPath = function(parts) {
        parts.unshift(updatesDir);

        return path.join.apply(path, parts || []);
    };

app.use(morgan());
app.use('/updates', express.static(updatesDir));

app.get('/:app', function(req, res) {
    var updates = [];

    findUpdates(buildPath([req.params.app]))
        .forEach(function(dir) {
            updates.push({
                url: buildUrl(['updates', req.params.app, dir, 'update.zip']),
                name: req.params.app + ' ' + dir,
                notes: fs.readFileSync(buildPath([req.params.app, dir, 'notes'])).toString('utf8'),
                pub_date: moment(fs.statSync(buildPath([req.params.app, dir, 'update.zip'])).mtime).format()
            })
        });

    res
        .status(200)
        .set({ 'Content-Type': 'application/json; charset=utf-8' })
        .json(updates);
});

app.get('/:app/:version', function(req, res) {
    var update;

    findUpdates(buildPath([req.params.app]))
        .forEach(function(dir) {
            var version = dir;

            if (semver.gt(version, req.params.version)) {
                update = version
            }
        });


    if (!update) {
        return res.status(204).end();
    }

    res
        .status(200)
        .set({ 'Content-Type': 'application/json; charset=utf-8' })
        .json({
            url: buildUrl(['updates', req.params.app, update, 'update.zip']),
            name: req.params.app + ' ' + update,
            notes: fs.readFileSync(buildPath([req.params.app, update, 'notes'])).toString('utf8'),
            pub_date: moment(fs.statSync(buildPath([req.params.app, update, 'update.zip'])).mtime).format()
        });
});

app.listen(port);
