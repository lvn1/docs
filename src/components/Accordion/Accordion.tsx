import { useRef, useState, createElement, useEffect } from 'react';
import { Expand, DeepDive } from './icons';
import { IconChevron } from '@/components/Icons';
import { trackExpanderOpen } from '@/utils/track';

type AccordionProps = {
  title?: string;
  headingLevel?: string;
  eyebrow?: string;
  children: React.ReactNode;
};

export const Accordion: React.FC<AccordionProps> = ({
  title,
  headingLevel,
  eyebrow,
  children
}) => {
  const [initialHeight, setInitialHeight] = useState(0);
  const [expandedHeight, setExpandedHeight] = useState(0);
  const docsExpander = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const expander = docsExpander.current;

    const initHeight =
      expander?.children['docs-expander__summary']?.offsetHeight;
    const expHeight = getHiddenHeight(expander);

    setInitialHeight(initHeight);
    setExpandedHeight(expHeight);
  }, [initialHeight, expandedHeight]);

  function getHiddenHeight(el) {
    if (!el?.cloneNode) {
      return null;
    }

    const clone = el.cloneNode(true);
    clone.setAttribute('open', '');
    el.after(clone);
    const height = clone.offsetHeight;
    clone.remove();
    return height;
  }

  const headingId = title?.replace(/\s+/g, '-').toLowerCase();
  headingLevel = headingLevel ? 'h' + headingLevel : 'div';
  const expanderTitle = createElement(
    headingLevel,
    {
      id: headingId,
      className: 'docs-expander__title'
    },
    title
  );

  const anchor = createElement(
    'a',
    { href: window.location.pathname + '#' + headingId },
    expanderTitle
  );

  const collapse = [
    {
      maxHeight: expandedHeight + 'px'
    },
    { maxHeight: initialHeight + 'px' }
  ];

  const expand = [
    { maxHeight: initialHeight + 'px' },
    {
      maxHeight: expandedHeight + 'px'
    }
  ];

  const animationTiming = {
    duration: 700,
    iterations: 1
  };

  const closeAccordion = () => {
    const expander = docsExpander.current;
    if (expander) {
      const scrollToLoc = expander.offsetTop - 48 - 70 - 10; // account for nav heights and 10px buffer

      expander.animate(collapse, animationTiming);
      window.scrollTo({
        left: 0,
        top: scrollToLoc,
        behavior: 'smooth'
      });
      setTimeout(function () {
        expander.removeAttribute('open');
      }, 700);
    }
  };

  const toggleAccordion = (e) => {
    e.preventDefault();

    const expander = docsExpander.current;
    // Close accordion
    if (expander?.hasAttribute('open')) {
      expander?.animate(collapse, animationTiming);
      setTimeout(function () {
        expander.removeAttribute('open');
      }, 700);
    } else {
      // Open accordion
      trackExpanderOpen(expander?.id.replace('-acc', ''));
      expander?.setAttribute('open', '');
      expander?.animate(expand, animationTiming);
    }
  };

  return (
    <details
      id={headingId + '-acc'}
      className="docs-expander"
      ref={docsExpander}
    >
      <summary
        id="docs-expander__summary"
        className="docs-expander__summary"
        onClick={toggleAccordion}
      >
        <div className="docs-expander__eyebrow">
          <DeepDive />
          {eyebrow}
        </div>
        {anchor}
        <div className="docs-expander__title__indicator">
          <Expand />
        </div>
      </summary>
      <div id="docs-expander__body" className="docs-expander__body">
        {children}
      </div>

      <button
        id="docs-expander__body__button"
        className="docs-expander__body__button"
        onClick={closeAccordion}
      >
        <Expand />
      </button>
    </details>
  );
};
