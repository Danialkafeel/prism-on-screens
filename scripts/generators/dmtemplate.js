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
      const dmtemplateAssets = $('div.dmtemplate');
      for (const dmtemplateAsset of dmtemplateAssets.children()) {
        const dmtemplateAssetChild = $(dmtemplateAsset).children().eq(1);
        console.log('dmtemplateAssetChild', dmtemplateAssetChild.text().trim());
        if (dmtemplateAssetChild.text().trim() !== ''){
          additionalAssets.push(`/is/image/${dmtemplateAssetChild.text().trim()}`);
        }
      }
      await ensureDir(p.dirname(path));
      await outputFile(`${path}.html`, $.html());
      additionalAssets.push('/blocks/dmtemplate/dmtemplate.js');
      additionalAssets.push('/blocks/dmtemplate/dmtemplate.css');
    } catch (error) {
      console.error(error);
    }
    return additionalAssets;
  };
}
