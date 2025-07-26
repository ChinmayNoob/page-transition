'use client';

import { useEffect, useRef } from 'react';
import SplitType from 'split-type';
import { gsap } from 'gsap';
import { wrapLines } from '@/lib/utils';

interface TextLinesRevealProps {
    children: React.ReactNode;
    className?: string;
}

export class TextLinesReveal {
    DOM: {
        el: HTMLElement;
    };
    SplitTypeInstance: SplitType;
    isVisible: boolean;
    inTimeline?: gsap.core.Timeline;
    outTimeline?: gsap.core.Timeline;

    constructor(DOM_el: HTMLElement) {
        this.DOM = {
            el: DOM_el
        };

        this.isVisible = false;
        this.SplitTypeInstance = new SplitType(this.DOM.el, { types: 'lines' });

        // Wrap the lines (div with class .oh)
        // The inner child will be the one animating the transform
        wrapLines(this.SplitTypeInstance.lines || [], 'div', 'oh');

        this.initEvents();
    }

    /**
     * Animates the lines in.
     * @param animation - with or without animation.
     * @returns the animation timeline
     */
    in(animation = true): gsap.core.Timeline {
        // Lines are visible
        this.isVisible = true;

        if (this.SplitTypeInstance.lines) {
            gsap.killTweensOf(this.SplitTypeInstance.lines);
        }

        this.inTimeline = gsap.timeline({
            defaults: {
                duration: 1.1,
                ease: 'power4.inOut'
            }
        })
            .addLabel('start', 0)
            .set(this.SplitTypeInstance.lines, {
                yPercent: 105
            }, 'start');

        if (animation) {
            this.inTimeline.to(this.SplitTypeInstance.lines, {
                yPercent: 0,
                stagger: 0.05
            }, 'start');
        } else {
            this.inTimeline.set(this.SplitTypeInstance.lines, {
                yPercent: 0
            }, 'start');
        }

        return this.inTimeline;
    }

    /**
     * Animates the lines out.
     * @param animation - with or without animation.
     * @returns the animation timeline
     */
    out(animation = true): gsap.core.Timeline {
        // Lines are invisible
        this.isVisible = false;

        if (this.SplitTypeInstance.lines) {
            gsap.killTweensOf(this.SplitTypeInstance.lines);
        }

        this.outTimeline = gsap.timeline({
            defaults: {
                duration: 1.1,
                ease: 'power4.inOut'
            }
        }).addLabel('start', 0);

        if (animation) {
            this.outTimeline.to(this.SplitTypeInstance.lines, {
                yPercent: -105,
                stagger: 0.05
            }, 'start');
        } else {
            this.outTimeline.set(this.SplitTypeInstance.lines, {
                yPercent: -105,
            }, 'start');
        }

        return this.outTimeline;
    }

    /**
     * Initializes some events.
     */
    initEvents(): void {
        // Re-initialize the Split Text on window resize.
        window.addEventListener('resize', () => {
            // Re-split text
            if (this.SplitTypeInstance) {
                this.SplitTypeInstance.split({ types: 'lines' });
            }

            // Need to wrap again the new lines elements (div with class .oh)
            if (this.SplitTypeInstance.lines) {
                wrapLines(this.SplitTypeInstance.lines, 'div', 'oh');
            }

            // Hide the lines
            if (!this.isVisible && this.SplitTypeInstance.lines) {
                gsap.set(this.SplitTypeInstance.lines, { yPercent: 105 });
            }
        });
    }
}

const TextLinesRevealComponent: React.FC<TextLinesRevealProps> = ({ children, className = '' }) => {
    const elementRef = useRef<HTMLParagraphElement>(null);

    return (
        <p ref={elementRef} className={className}>
            {children}
        </p>
    );
};

export default TextLinesRevealComponent; 