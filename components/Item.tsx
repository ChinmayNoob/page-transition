'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Preview } from './Preview';

interface ItemData {
    meta: string;
    title: string;
    image: string;
    desc: string;
}

interface ItemProps {
    data: ItemData;
    preview: Preview | null;
    onItemClick: () => void;
}

export class Item {
    DOM: {
        el: HTMLElement | null;
        image: HTMLElement | null;
        imageInner: HTMLElement | null;
        link: HTMLElement | null;
        meta: HTMLElement | null;
        title: HTMLElement | null;
        desc: HTMLElement | null;
    };
    preview: Preview | null;

    constructor(DOM_el: HTMLElement, previewEl: Preview | null) {
        this.DOM = {
            el: DOM_el,
            image: null,
            imageInner: null,
            link: null,
            meta: null,
            title: null,
            desc: null
        };

        this.preview = previewEl;

        // Add null check for this.DOM.el before calling querySelector
        if (this.DOM.el) {
            this.DOM.image = this.DOM.el.querySelector('.item__img');
            this.DOM.imageInner = this.DOM.el.querySelector('.item__img-inner');
            this.DOM.link = this.DOM.el.querySelector('.item__link');
            this.DOM.meta = this.DOM.el.querySelector('.item__meta');
            this.DOM.title = this.DOM.el.querySelector('.item__title');
            this.DOM.desc = this.DOM.el.querySelector('.item__desc');
        }

        this.initEvents();
    }

    initEvents(): void {
        if (!this.DOM.link || !this.DOM.imageInner) return;

        this.DOM.link.addEventListener('mouseenter', () => {
            if (!this.DOM.imageInner) return;
            gsap.killTweensOf(this.DOM.imageInner);
            gsap.to(this.DOM.imageInner, {
                duration: 2,
                ease: 'power4',
                scale: 1.2
            });
        });

        this.DOM.link.addEventListener('mouseleave', () => {
            if (!this.DOM.imageInner) return;
            gsap.killTweensOf(this.DOM.imageInner);
            gsap.to(this.DOM.imageInner, {
                duration: 0.7,
                ease: 'expo',
                scale: 1
            });
        });
    }
}

const ItemComponent: React.FC<ItemProps> = ({ data, onItemClick }) => {
    const itemRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (itemRef.current) {
            const itemInstance = new Item(itemRef.current, null);

            // Add click event listener
            const linkElement = itemRef.current.querySelector('.item__link');
            if (linkElement) {
                linkElement.addEventListener('click', onItemClick);
            }

            return () => {
                // Cleanup event listeners
                if (linkElement) {
                    linkElement.removeEventListener('click', onItemClick);
                }
            };
        }
    }, [onItemClick]);

    return (
        <div ref={itemRef} className="item">
            <span className="item__meta">{data.meta}</span>
            <h2 className="item__title">{data.title}</h2>
            <div className="item__img">
                <div
                    className="item__img-inner"
                    style={{ backgroundImage: `url(${data.image})` }}
                />
            </div>
            <p className="item__desc">{data.desc}</p>
            <a className="item__link">view</a>
        </div>
    );
};

export default ItemComponent; 