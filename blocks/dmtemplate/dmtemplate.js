import { createOptimizedPicture } from '../../scripts/lib-franklin.js';
export default async function decorate(block) {
  block.setAttribute('data-item-length', block.children.length);
  [...block.children].forEach(row => {
    const DEFAULT_DISPLAY_DURATION = 5000;//5 ms 
    let rowId = 0;
    row.setAttribute('style', 'display:none');
    row.setAttribute('data-item-id', ++rowId);    
    const columns = [...row.children];
    columns[0].setAttribute('style', 'display:none');
    columns[1].setAttribute('style', 'display:none');    
    let templateName = columns[1]?.firstElementChild?.innerText;
    console.log(`dhaval ${templateName}`);
    if (!templateName) {
      templateName = 'pmodiCo/WelcomePage';
    }
    const imageName = `/is/image/${templateName}`;
    const img = createOptimizedPicture(imageName);
    
    row.setAttribute('data-item-duration', DEFAULT_DISPLAY_DURATION);
    row.setAttribute('data-type', 'image');
    row.appendChild(img);
​  });  
  displayNextVisibleItem();​
  function displayNextVisibleItem() {
      if (block.children.length <= 0) {
          return;
      }
      let nextVisibleItem = findNextVisibleItem();
      if (!nextVisibleItem) {
          nextVisibleItem = block.firstElementChild;
      }
      nextVisibleItem.setAttribute('style', 'display:block');
      let duration = nextVisibleItem.getAttribute('data-item-duration');
      if (duration) {
          setTimeout(() => {
              displayNextVisibleItem();
          }, duration);
      }
  }
​
  function findNextVisibleItem() {
      let visibleItem = [...block.children].find((row) => row.getAttribute('style') === 'display:block');
      if (visibleItem) {
          visibleItem = visibleItem.nextElementSibling;
          const itemId = visibleItem ? visibleItem.getAttribute('data-item-id'): -1;
          //make sure all other items are hidden
          [...block.children].forEach(row => {
              if (row.getAttribute('data-item-id') != itemId) {
                  row.setAttribute('style', 'display:none');
              }
          });
      }
      return visibleItem;
  }
}
