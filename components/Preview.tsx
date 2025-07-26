'use client';

import { useEffect, useRef } from 'react';
import { TextLinesReveal } from './TextLinesReveal';

interface PreviewData {
    title: string;
    subtitle: string;
    name: string;
    year: string;
    image: string;
    location: string;
    material: string;
}

interface PreviewProps {
    data: PreviewData;
    onBackClick: () => void;
}

export class Preview {
    DOM: {
        el: HTMLElement | null;
        image: HTMLElement | null;
        imageInner: HTMLElement | null;
        title: HTMLElement | null;
        backCtrl: HTMLElement | null;
        innerElements: HTMLElement[];
        multiLineWrap: HTMLElement[];
    };
    multiLines: TextLinesReveal[];

    constructor(DOM_el: HTMLElement) {
        this.DOM = {
            el: DOM_el,
            image: null,
            imageInner: null,
            title: null,
            backCtrl: null,
            innerElements: [],
            multiLineWrap: []
        };

        this.multiLines = [];

        this.DOM.image = this.DOM.el.querySelector('.preview__img');
        this.DOM.imageInner = this.DOM.el.querySelector('.preview__img-inner');
        this.DOM.title = this.DOM.el.querySelector('.preview__title');
        this.DOM.backCtrl = this.DOM.el.querySelector('.preview__back');

        this.DOM.innerElements = [...this.DOM.el.querySelectorAll('.oh__inner')] as HTMLElement[];

        // the TextLinesReveal instance (animate each text line using the SplitText library)
        this.DOM.multiLineWrap = [...this.DOM.el.querySelectorAll('.preview__column > p')] as HTMLElement[];
        this.DOM.multiLineWrap.forEach(line => {
            this.multiLines.push(new TextLinesReveal(line));
        });
    }
}

const PreviewComponent: React.FC<PreviewProps> = ({ data, onBackClick }) => {
    const previewRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (previewRef.current) {
            // Add click event listener for back button
            const backButton = previewRef.current.querySelector('.preview__back');
            if (backButton) {
                backButton.addEventListener('click', onBackClick);
            }

            return () => {
                // Cleanup event listeners
                if (backButton) {
                    backButton.removeEventListener('click', onBackClick);
                }
            };
        }
    }, [onBackClick]);

    return (
        <div ref={previewRef} className="preview">
            <div className="preview__img">
                <div
                    className="preview__img-inner"
                    style={{ backgroundImage: `url(${data.image})` }}
                />
            </div>
            <h2 className="preview__title oh">
                <span className="oh__inner">{data.title}</span>
            </h2>
            <div className="preview__column preview__column--start">
                <span className="preview__column-title preview__column-title--main oh">
                    <span className="oh__inner">{data.name}</span>
                </span>
                <span className="oh">
                    <span className="oh__inner">{data.year}</span>
                </span>
            </div>
            <div className="preview__column">
                <h3 className="preview__column-title oh">
                    <span className="oh__inner">Location</span>
                </h3>
                <p>{data.location}</p>
            </div>
            <div className="preview__column">
                <h3 className="preview__column-title oh">
                    <span className="oh__inner">Material</span>
                </h3>
                <p>{data.material}</p>
            </div>
            <button className="unbutton preview__back">
                <svg width="100px" height="18px" viewBox="0 0 50 9">
                    <path vectorEffect="non-scaling-stroke" d="m0 4.5 5-3m-5 3 5 3m45-3h-77" />
                </svg>
            </button>
        </div>
    );
};

export default PreviewComponent; 