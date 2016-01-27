import expect from 'expect';
import UrlGenerator from '../../../lib/utils/urlGenerator';
import App from '../../../lib/models/app';
import Release from '../../../lib/models/release';

describe('UrlGenerator', () => {
    it('generate the right url for a release', () => {
        const baseUrl = 'http://baseUrl',
            generator = new UrlGenerator(baseUrl),
            app = new App('app'),
            release = new Release('v1', 'notes', new Date());

        expect(generator.generateDownloadReleaseUrl(app, release))
            .toEqual('http://baseUrl/app/v1/update')
    });
});
