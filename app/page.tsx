'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Item } from '@/components/Item';
import { Preview } from '@/components/Preview';
import ItemComponent from '@/components/Item';
import PreviewComponent from '@/components/Preview';
import { preloadImages } from '@/lib/utils';

// Sample data - you can replace this with your own data
const itemsData = [
  {
    meta: "2020",
    title: "Alex Moulder",
    image: "/1.jpg",
    desc: "I am only waiting for love to give myself up at last into his hands. That is why it is so late and why I have been guilty of such omissions."
  },
  {
    meta: "2021",
    title: "Aria Bennett",
    image: "/2.jpg",
    desc: "They come with their laws and their codes to bind me fast; but I evade them ever, for I am only waiting for love to give myself up at last into his hands."
  },
  {
    meta: "2022",
    title: "Jimmy Hughes",
    image: "/3.jpg",
    desc: "Clouds heap upon clouds and it darkens. Ah, love, why dost thou let me wait outside at the door all alone?"
  }
];

const previewsData = [
  {
    title: "Moulder",
    subtitle: "Alex Moulder",
    name: "Alex Moulder",
    year: "2020",
    image: "/1_big.jpg",
    location: "And if it rains, a closed car at four. And we shall play a game of chess, pressing lidless eyes and waiting for a knock upon the door.",
    material: "At the violet hour, when the eyes and back, turn upward from the desk, when the human engine waits."
  },
  {
    title: "Bennett",
    subtitle: "Aria Bennett",
    name: "Aria Bennett",
    year: "2021",
    image: "/2_big.jpg",
    location: "And if it rains, a closed car at four. And we shall play a game of chess, pressing lidless eyes and waiting for a knock upon the door.",
    material: "At the violet hour, when the eyes and back, turn upward from the desk, when the human engine waits."
  },
  {
    title: "Hughes",
    subtitle: "Jimmy Hughes",
    name: "Jimmy Hughes",
    year: "2022",
    image: "/3_big.jpg",
    location: "And if it rains, a closed car at four. And we shall play a game of chess, pressing lidless eyes and waiting for a knock upon the door.",
    material: "At the violet hour, when the eyes and back, turn upward from the desk, when the human engine waits."
  }
];

export default function Page() {
  const [currentPreview, setCurrentPreview] = useState<number | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const overlayRowsRef = useRef<HTMLDivElement[]>([]);
  const itemsRef = useRef<Item[]>([]);
  const previewsRef = useRef<Preview[]>([]);

  useEffect(() => {
    // Preload images
    preloadImages().then(() => {
      console.log('Images loaded');
    });

    // Initialize items and previews
    const itemElements = document.querySelectorAll('.item');
    const previewElements = document.querySelectorAll('.preview');

    // Clear arrays
    itemsRef.current = [];
    previewsRef.current = [];

    // Create Preview instances
    previewElements.forEach(preview => {
      previewsRef.current.push(new Preview(preview as HTMLElement));
    });

    // Create Item instances
    itemElements.forEach((item, pos) => {
      itemsRef.current.push(new Item(item as HTMLElement, previewsRef.current[pos] || null));
    });

  }, []);

  const openItem = (itemIndex: number) => {
    const item = itemsRef.current[itemIndex];
    if (!item || !item.preview) return;

    const contentEl = contentRef.current;
    const frameEl = frameRef.current;
    const overlayRows = overlayRowsRef.current;

    gsap.timeline({
      defaults: {
        duration: 1,
        ease: 'power3.inOut'
      }
    })
      .add(() => {
        // pointer events none to the content
        if (contentEl) {
          contentEl.classList.add('content--hidden');
        }
      }, 'start')

      .addLabel('start', 0)
      .set([item.preview.DOM.innerElements, item.preview.DOM.backCtrl], {
        opacity: 0
      }, 'start')
      .to(overlayRows, {
        scaleY: 1
      }, 'start')

      .addLabel('content', 'start+=0.6')

      .add(() => {
        document.body.classList.add('preview-visible');

        if (frameEl) {
          gsap.set(frameEl, {
            opacity: 0
          });
        }

        if (item.preview?.DOM.el) {
          item.preview.DOM.el.classList.add('preview--current');
        }
      }, 'content')
      // Image animation (reveal animation)
      .to([item.preview.DOM.image, item.preview.DOM.imageInner], {
        startAt: { y: (pos: number) => pos ? '101%' : '-101%' },
        y: '0%'
      }, 'content')

      .add(() => {
        if (item.preview) {
          for (const line of item.preview.multiLines) {
            line.in();
          }
          gsap.set(item.preview.DOM.multiLineWrap, {
            opacity: 1,
            delay: 0.1
          });
        }
      }, 'content')
      // animate frame element
      .to(frameEl, {
        ease: 'expo',
        startAt: { y: '-100%', opacity: 0 },
        opacity: 1,
        y: '0%'
      }, 'content+=0.3')
      .to(item.preview.DOM.innerElements, {
        ease: 'expo',
        startAt: { yPercent: 101 },
        yPercent: 0,
        opacity: 1
      }, 'content+=0.3')
      .to(item.preview.DOM.backCtrl, {
        opacity: 1
      }, 'content');

    setCurrentPreview(itemIndex);
  };

  const closeItem = () => {
    if (currentPreview === null) return;

    const item = itemsRef.current[currentPreview];
    if (!item || !item.preview) return;

    const contentEl = contentRef.current;
    const frameEl = frameRef.current;
    const overlayRows = overlayRowsRef.current;

    gsap.timeline({
      defaults: {
        duration: 1,
        ease: 'power3.inOut'
      }
    })
      .addLabel('start', 0)
      .to(item.preview.DOM.innerElements, {
        yPercent: -101,
        opacity: 0,
      }, 'start')
      .add(() => {
        if (item.preview) {
          for (const line of item.preview.multiLines) {
            line.out();
          }
        }
      }, 'start')

      .to(item.preview.DOM.backCtrl, {
        opacity: 0
      }, 'start')

      .to(item.preview.DOM.image, {
        y: '101%'
      }, 'start')
      .to(item.preview.DOM.imageInner, {
        y: '-101%'
      }, 'start')

      // animate frame element
      .to(frameEl, {
        opacity: 0,
        y: '-100%',
        onComplete: () => {
          document.body.classList.remove('preview-visible');
          if (frameEl) {
            gsap.set(frameEl, {
              opacity: 1,
              y: '0%'
            });
          }
        }
      }, 'start')

      .addLabel('grid', 'start+=0.6')

      .to(overlayRows, {
        scaleY: 0,
        onComplete: () => {
          if (item.preview?.DOM.el) {
            item.preview.DOM.el.classList.remove('preview--current');
          }
          if (contentEl) {
            contentEl.classList.remove('content--hidden');
          }
        }
      }, 'grid');

    setCurrentPreview(null);
  };

  return (
    <main>
      <div ref={frameRef} className="frame">
        <div className="frame__title">
          <h1 className="frame__title-main">Cover Page Transition</h1>
          <br />
        </div>
      </div>

      <div ref={contentRef} className="content">
        {itemsData.map((item, index) => (
          <ItemComponent
            key={index}
            data={item}
            preview={null}
            onItemClick={() => openItem(index)}
          />
        ))}
      </div>

      <div className="overlay">
        <div
          ref={el => { if (el) overlayRowsRef.current[0] = el; }}
          className="overlay__row"
        />
        <div
          ref={el => { if (el) overlayRowsRef.current[1] = el; }}
          className="overlay__row"
        />
      </div>

      <section className="previews">
        {previewsData.map((preview, index) => (
          <PreviewComponent
            key={index}
            data={preview}
            onBackClick={closeItem}
          />
        ))}
      </section>
    </main>
  );
}