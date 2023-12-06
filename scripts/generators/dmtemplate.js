import { outputFile, ensureDir } from 'fs-extra';
import p from 'path';
// eslint-disable-next-line import/no-extraneous-dependencies
import { load } from 'cheerio';
import { getFranklinMarkup } from './utils.js';

export default class HtmlGenerator {
  static generateHTML = async (host, path) => {
    console.log(`running dmtemplate generator for ${path}`);
    const additionalAssets = [];
    try {
    // Get default franklin markup for path
      const franklinString = await getFranklinMarkup(host, path);
      const $ = load(franklinString);
      await ensureDir(p.dirname(path));
      await outputFile(`${path}.html`, $.html());
      additionalAssets.push('/blocks/dmtemplate/dmtemplate.js');
      const dmtemplatename = $('.dmtemplate').text().trim();
      console.log(`dmtemplatename: ${dmtemplatename}`);
      additionalAssets.push(`/is/image/${dmtemplatename}`);
      additionalAssets.push('/blocks/dmtemplate/dmtemplate.css');
    } catch (error) {
      console.error(error);
    }
    return additionalAssets;
  };
}
