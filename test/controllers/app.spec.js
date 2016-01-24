import 'babel-polyfill';
import expect from 'expect';
import UrlGenerator from '../../lib/utils/urlGenerator';
import App from '../../lib/models/app';
import Release from '../../lib/models/release';
import AppController from '../../lib/controllers/app';
import createError from "http-errors";

describe('App Controller', () => {
    const baseUrl = 'http://baseUrl',
        generator = new UrlGenerator(baseUrl),
        todoApp = new App('todo'),
        today = new Date(),
        todoRelease = new Release('1.0.0', 'notes', today),
        mockAppFinder = {
            apps: async () => [todoApp],
            app: async name => (name === 'todo' ? todoApp : null)
        },
        mockReleaseFinder = {
            releases: async () => [todoRelease],
            release: async () => todoRelease
        };

    it('list apps', async () => {
        const controller = new AppController(mockAppFinder, mockReleaseFinder, generator);
        const context = {
            headers: {},
            set: function(key, value) {
                this.headers[key] = value;
            },
            assert: function(condition, status, message) {
                if (!condition) {
                    this.status = status;
                    this.body = message;
                }
            }
        };

        await controller.listAction(context);

        expect(context.status)
            .toEqual(200);
        expect(context.headers)
            .toEqual({ 'Content-Type': 'application/json; charset=utf-8' });
        expect(context.body)
            .toEqual([ todoApp ]);
    });

    it('show defined app', async () => {
        const controller = new AppController(mockAppFinder, mockReleaseFinder, generator);
        const context = {
            headers: {},
            set: function(key, value) {
                this.headers[key] = value;
            },
            assert: () => {}
        };

        await controller.showAction(context, 'todo');

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

    it('show undefined app', async () => {
        const controller = new AppController(mockAppFinder, mockReleaseFinder, generator);
        const context = {
            headers: {},
            set: function(key, value) {
                this.headers[key] = value;
            },
            assert: function(condition, status, message) {
                if (condition) {
                    return;
                }

                this.status = status;
                this.body = message;

                throw new createError(status, message);
            }
        };

        try {
            await controller.showAction(context, 'tata');
        } catch(error) {}

        expect(context.status)
            .toEqual(404);
    });

    it('show release to download', async () => {
        const controller = new AppController(mockAppFinder, mockReleaseFinder, generator);
        const context = {
            headers: {},
            set: function(key, value) {
                this.headers[key] = value;
            },
            assert: () => {}
        };

        await controller.releaseAction(context, 'todo', '0.0.0');

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

    it('no release to download', async () => {
        const controller = new AppController(mockAppFinder, mockReleaseFinder, generator);
        const context = {
            headers: {},
            set: function(key, value) {
                this.headers[key] = value;
            },
            assert: () => {}
        };

        await controller.releaseAction(context, 'todo', '1.0.0');

        expect(context.status)
            .toEqual(204);
    });
});
