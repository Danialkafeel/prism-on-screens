import {
  sampleRUM,
  buildBlock,
  decorateButtons,
  decorateIcons,
  decorateSections,
  decorateBlocks,
  decorateTemplateAndTheme,
  waitForLCP,
  loadBlocks,
  loadCSS,
  getMetadata,
  decorateBlock,
} from './lib-franklin.js';

import {
  buildCaraouselBlock
} from './lib-autoblocks.js'

const LCP_BLOCKS = []; // add your LCP blocks to the list

/**
 * Builds hero block and prepends to main in a new section.
 * @param {Element} main The container element
 */
function buildHeroBlock(main) {
  const h1 = main.querySelector('h1');
  const picture = main.querySelector('picture');
  // eslint-disable-next-line no-bitwise
  if (h1 && picture && (h1.compareDocumentPosition(picture) & Node.DOCUMENT_POSITION_PRECEDING)) {
    const section = document.createElement('div');
    section.append(buildBlock('hero', { elems: [picture, h1] }));
    main.prepend(section);
  }
}

function createDivWithClass(className) {
  const div = document.createElement('div');
  div.className = className;
  return div;
}

async function buildCaraouselBlock(main) {
  // track to hold all carousel items
  const carouselTrack = createDivWithClass('carousel-track');

  // select segments
  const segments = main.querySelectorAll('.carousel-segment[data-toggle="on"]');

  segments.forEach((segment) => {
    // for each segment, fill with carousel items and then append segment to track
    const picturesInSegment = segment.querySelectorAll('picture');
    const carouselSegment = createDivWithClass('carousel-segment');
    cloneDataAttributes(carouselSegment, segment);
    picturesInSegment.forEach((item) => {
      const carouselItem = createDivWithClass('carousel-item');
      carouselItem.append(item);
      carouselSegment.append(carouselItem);
    });
    carouselTrack.append(carouselSegment);
  });

  const carouselContainer = buildBlock('carousel', carouselTrack);
  const carouselContainerEle = document.createElement('div');
  carouselContainerEle.append(carouselContainer);
  decorateBlock(carouselContainer);
  main.innerHTML = '';
  main.appendChild(carouselContainer);
}

function cloneDataAttributes(target, source) {
  [...source.attributes]
      .filter((attr) => attr.nodeName.startsWith('data'))
      .forEach(attr => { target.setAttribute(attr.nodeName, attr.nodeValue) })
}

/**
 * Builds all synthetic blocks in a container element.
 * @param {Element} main The container element
 */
function buildAutoBlocks(main) {
  try {
    buildHeroBlock(main);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Auto Blocking failed', error);
  }
}

/**
 * Decorates the main element.
 * @param {Element} main The main element
 */
// eslint-disable-next-line import/prefer-default-export
export function decorateMain(main) {
  // hopefully forward compatible button decoration
  decorateButtons(main);
  decorateIcons(main);
  buildAutoBlocks(main);
  decorateSections(main);
  decorateBlocks(main);
}

/**
 * Loads everything needed to get to LCP.
 * @param {Element} doc The container element
 */
async function loadEager(doc) {
  document.documentElement.lang = 'en';
  decorateTemplateAndTheme();
  const main = doc.querySelector('main');
  if (main) {
    decorateMain(main);
    document.body.classList.add('appear');
    await waitForLCP(LCP_BLOCKS);
  }
}

/**
 * Adds the favicon.
 * @param {string} href The favicon URL
 */
export function addFavIcon(href) {
  const link = document.createElement('link');
  link.rel = 'icon';
  link.type = 'image/png';
  link.href = href;
  const existingLink = document.querySelector('head link[rel="icon"]');
  if (existingLink) {
    existingLink.replaceWith(link);
  } else {
    document.head.append(link);
  }
}

/**
 * Loads everything that doesn't need to be delayed.
 * @param {Element} doc The container element
 */
async function loadLazy(doc) {
  const main = doc.querySelector('main');
  const template = getMetadata('template');
  switch (template) {
    case 'carousel':
      await loadBlocks(main);
      await buildCaraouselBlock(main);
      break;
    default:
      console.log(`Unexpected template: ${template}`);
      break;
  }

  await loadBlocks(main);

  const { hash } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : false;
  if (hash && element) element.scrollIntoView();

  loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);
  addFavIcon(`${window.hlx.codeBasePath}/styles/favicon.png`);
  sampleRUM('lazy');
  sampleRUM.observe(main.querySelectorAll('div[data-block-name]'));
  sampleRUM.observe(main.querySelectorAll('picture > img'));
}

/**
 * Loads everything that happens a lot later,
 * without impacting the user experience.
 */
function loadDelayed() {
  // eslint-disable-next-line import/no-cycle
  window.setTimeout(() => import('./delayed.js'), 3000);
  // load anything that can be postponed to the latest here
}

async function loadPage() {
  await loadEager(document);
  await loadLazy(document);
  loadDelayed();
}

loadPage();
