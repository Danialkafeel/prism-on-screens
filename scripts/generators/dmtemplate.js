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
      for (const dmtemplateAsset of dmtemplateAssets) {
        // check second child div of dmtemplateAsset
        const dmtemplateAssetChild = dmtemplateAsset.children[1];
        console.log('dmtemplateAssetChild', dmtemplateAssetChild.innerHTML);
        if (dmtemplateAssetChild.innerHTML !== ''){
          additionalAssets.push(`/is/image/${dmtemplateAssetChild.innerHTML}`);
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
