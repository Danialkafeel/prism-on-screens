import { createOptimizedPicture } from '../../scripts/lib-franklin.js';

export default async function decorate(block) {

    //block.setAttribute('style', 'display:none');
    const column = block.firstElementChild;
    const templateDiv = column.firstElementChild;
    column.setAttribute('style', 'display:none');
    const templateName = templateDiv.innerText;
    const imageName = "/dmtemplate/" + templateName;
    const img = createOptimizedPicture(imageName);
    block.appendChild(img);
    console.log("Template Name = " + templateName);
}
