import 'babel-polyfill';
import expect from 'expect';
import UrlGenerator from '../../lib/utils/urlGenerator';
import App from '../../lib/models/app';
import Release from '../../lib/models/release';
import AppController from '../../lib/controllers/app';

describe('App Controller', () => {
    const baseUrl = 'http://baseUrl',
        generator = new UrlGenerator(baseUrl),
        todoApp = new App('todo'),
        today = new Date(),
        todoRelease = new Release('1.0.0', 'notes', today),
        mockAppFinder = {
            apps: function*() { yield todoApp },
            app: (name) => (name === 'todo' ? todoApp : null)
        },
        mockReleaseFinder = {
            releases: function*(name) { yield todoRelease; },
            release: (app, version) => todoRelease
        };

    it('list apps', () => {
        const controller = new AppController(mockAppFinder, mockReleaseFinder, generator);
        const context = {
            headers: {},
            set: function(key, value) {
                this.headers[key] = value;
            }
        };
        const gen = controller.listAction(context);
        gen.next();

        expect(context.status)
            .toEqual(200);
        expect(context.headers)
            .toEqual({ 'Content-Type': 'application/json; charset=utf-8' });
        expect(context.body)
            .toEqual([ { name: 'todo' } ]);
    });

    it('show defined app', () => {
        const controller = new AppController(mockAppFinder, mockReleaseFinder, generator);
        const context = {
            headers: {},
            set: function(key, value) {
                this.headers[key] = value;
            }
        };
        const gen = controller.showAction(context, 'todo');
        gen.next();

        expect(context.status)
            .toEqual(200);
        expect(context.headers)
            .toEqual({ 'Content-Type': 'application/json; charset=utf-8' });
        expect(context.body)
            .toEqual([
                {
                    date: today,
                    notes: 'notes',
                    url: 'http://baseUrl/todo/1.0.0/update',
                    version: '1.0.0'
                }
            ]);
    });

    it('show undefined app', () => {
        const controller = new AppController(mockAppFinder, mockReleaseFinder, generator);
        const context = {
            headers: {},
            set: function(key, value) {
                this.headers[key] = value;
            }
        };
        const gen = controller.showAction(context, 'tata');
        gen.next();

        expect(context.status)
            .toEqual(404);
    });

    it('show release to download', () => {
        const controller = new AppController(mockAppFinder, mockReleaseFinder, generator);
        const context = {
            headers: {},
            set: function(key, value) {
                this.headers[key] = value;
            }
        };
        const gen = controller.releaseAction(context, 'todo', '0.0.0');
        gen.next();

        expect(context.status)
            .toEqual(200);
        expect(context.headers)
            .toEqual({ 'Content-Type': 'application/json; charset=utf-8' });
        expect(context.body)
            .toEqual({
                date: today,
                notes: 'notes',
                url: 'http://baseUrl/todo/1.0.0/update',
                version: '1.0.0'
            });
    });

    it('no release to download', () => {
        const controller = new AppController(mockAppFinder, mockReleaseFinder, generator);
        const context = {
            headers: {},
            set: function(key, value) {
                this.headers[key] = value;
            }
        };
        const gen = controller.releaseAction(context, 'todo', '1.0.0');
        gen.next();

        expect(context.status)
            .toEqual(204);
    });
});
