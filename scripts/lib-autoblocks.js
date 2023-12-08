import { getMetadata, decorateBlock, buildBlock } from './lib-franklin.js';

function createDivWithClass(className) {
    const div = document.createElement('div');
    div.className = className;
    return div;
}


export async function buildCaraouselBlock(main) {
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
