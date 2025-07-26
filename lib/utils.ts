/**
 * Preload images
 * @param selector - Selector/scope from where images need to be preloaded. Default is 'img'
 */
export const preloadImages = (selector = 'img'): Promise<void> => {
    return new Promise((resolve) => {
        const images = document.querySelectorAll(selector);
        let loaded = 0;
        const total = images.length;

        if (total === 0) {
            resolve();
            return;
        }

        const checkComplete = () => {
            loaded++;
            if (loaded === total) {
                resolve();
            }
        };

        images.forEach((img) => {
            if (img instanceof HTMLImageElement) {
                if (img.complete) {
                    checkComplete();
                } else {
                    img.addEventListener('load', checkComplete);
                    img.addEventListener('error', checkComplete);
                }
            } else {
                // Handle background images
                const bgImage = window.getComputedStyle(img).backgroundImage;
                if (bgImage && bgImage !== 'none') {
                    const src = bgImage.replace(/url\(['"]?(.*?)['"]?\)/i, '$1');
                    const tempImg = new Image();
                    tempImg.onload = checkComplete;
                    tempImg.onerror = checkComplete;
                    tempImg.src = src;
                } else {
                    checkComplete();
                }
            }
        });
    });
};

/**
 * Wraps the elements of an array.
 * @param arr - the array of elements to be wrapped
 * @param wrapType - the type of the wrap element ('div', 'span' etc)
 * @param wrapClass - the wrap class(es)
 */
export const wrapLines = (arr: Element[], wrapType: string, wrapClass: string): void => {
    arr.forEach(el => {
        const wrapEl = document.createElement(wrapType);
        wrapEl.className = wrapClass;
        el.parentNode?.appendChild(wrapEl);
        wrapEl.appendChild(el);
    });
}; 