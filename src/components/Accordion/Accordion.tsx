import { useRef, useState, createElement, useEffect } from 'react';
import { View, Link } from '@aws-amplify/ui-react';
import { Expand, DeepDive } from './icons';
import { IconChevron } from '@/components/Icons';
import { trackExpanderOpen } from '@/utils/track';

type AccordionProps = {
  title?: string;
  headingLevel?: '2' | '3' | '4' | '5' | '6';
  eyebrow?: string;
  children: React.ReactNode;
};

const linkableHeadings = ['2', '3'];

export const Accordion: React.FC<AccordionProps> = ({
  title,
  headingLevel: headingLevel,
  eyebrow,
  children
}) => {
  const docsExpander = useRef<HTMLDetailsElement>(null);

  // useEffect(() => {
  //   if(title) {
  //     setHeadingId(title?.replace(/\s+/g, '-').toLowerCase())
  //     setHref(window.location.pathname + '#' + headingId);
  //   }
  // }, [title, headingId]);

  const headingId = title?.replace(/\s+/g, '-').toLowerCase();
  const linkableHeading =
    headingLevel && linkableHeadings.includes[headingLevel];
  const headingEl: React.ElementType = linkableHeading
    ? `h${headingLevel}`
    : 'div';

  const href = headingId ? window.location.pathname + '#' + headingId : null;

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

  const anchor = createElement(
    'a',
    { href: window.location.pathname + '#' + headingId },
    expanderTitle
  );

  // const collapse = [
  //   {
  //     maxHeight: expandedHeight + 'px'
  //   },
  //   { maxHeight: initialHeight + 'px' }
  // ];

  // const expand = [
  //   { maxHeight: initialHeight + 'px' },
  //   {
  //     maxHeight: expandedHeight + 'px'
  //   }
  // ];

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
        <View as={headingEl}>
          {href ? <Link href={href}>{title}</Link> : title}
        </View>
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
