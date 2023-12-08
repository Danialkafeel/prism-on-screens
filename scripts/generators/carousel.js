import { outputFile, ensureDir } from 'fs-extra';
import p from 'path';
// eslint-disable-next-line import/no-extraneous-dependencies
import { load } from 'cheerio';
import { getFranklinMarkup } from './utils.js';

export default class HtmlGenerator {
    static generateHTML = async (host, path) => {
        console.log(`running carousel generator for ${path}`);
        const additionalAssets = [];
        try {
            // Get default franklin markup for path
            const franklinString = await getFranklinMarkup(host, path);
            const $ = load(franklinString);
            await ensureDir(p.dirname(path));
            await outputFile(`${path}.html`, $.html());
            additionalAssets.push('/blocks/carousel/carousel.css');
            additionalAssets.push('/blocks/carousel/carousel.js');
            additionalAssets.push('/blocks/fragment/fragment.css');
            additionalAssets.push('/blocks/fragment/fragment.js');
        } catch (error) {
            console.error(error);
        }
        return additionalAssets;
    };
}
