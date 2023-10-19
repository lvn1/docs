import { useRef, useState, useEffect, useLayoutEffect } from 'react';
import { View, Link, Flex, Button } from '@aws-amplify/ui-react';
import classNames from 'classnames';
import { IconChevron, IconDeepDive } from '@/components/Icons';
import { trackExpanderOpen } from '@/utils/track';

type ExpanderProps = {
  title?: string;
  headingLevel?: '2' | '3' | '4' | '5' | '6';
  eyebrow?: string;
  children: React.ReactNode;
};

const linkableHeadings = ['2', '3'];

export const Expander: React.FC<ExpanderProps> = ({
  title,
  headingLevel: headingLevel,
  eyebrow,
  children
}) => {
  const [initialHeight, setInitialHeight] = useState('none');
  const [expandedHeight, setExpandedHeight] = useState('none');
  const [expanded, setExpanded] = useState(false);
  const docsExpander = useRef<HTMLDetailsElement>(null);

  useLayoutEffect(() => {
    const expander = docsExpander.current;
    setInitialHeight(
      expander?.children['expander__summary']?.offsetHeight + 'px'
    );
    setExpandedHeight(getHiddenHeight(expander) + 'px');
  }, [docsExpander]);

  const headingId = title?.replace(/\s+/g, '-').toLowerCase();
  const linkableHeading =
    headingLevel && linkableHeadings.includes(headingLevel);
  const headingEl: React.ElementType = linkableHeading
    ? `h${headingLevel}`
    : 'div';

  const href = headingId ? window.location.pathname + '#' + headingId : null;
  const detailsStyles = {
    maxHeight: expanded ? expandedHeight : initialHeight
  } as React.CSSProperties;

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

  const closeAccordion = () => {
    const expander = docsExpander.current;
    if (expander) {
      const scrollToLoc = expander.offsetTop - 48 - 70 - 10; // account for nav heights and 10px buffer

      window.scrollTo({
        left: 0,
        top: scrollToLoc,
        behavior: 'smooth'
      });

      setExpanded(false);
    }
  };

  const toggleAccordion = (e) => {
    e.preventDefault();
    const expander = docsExpander.current;
    // Close accordion
    if (expanded) {
      setExpanded(false);
    } else {
      // Open accordion
      trackExpanderOpen(expander?.id.replace('-acc', ''));
      setExpanded(true);
    }
  };

  return (
    <View
      as="details"
      id={headingId + '-acc'}
      open={expanded}
      className="expander"
      ref={docsExpander}
      style={detailsStyles}
    >
      <Flex
        as="summary"
        id="expander__summary"
        className="expander__summary"
        onClick={toggleAccordion}
      >
        <Flex className="expander__title-group">
          <Flex className="expander__eyebrow">
            <IconDeepDive className="expander__deepdive" />
            {eyebrow}
          </Flex>
          <View as={headingEl} className="expander__title">
            {href && linkableHeading ? (
              <Link href={href} className="expander__title__link">
                {title}
              </Link>
            ) : (
              title
            )}
          </View>
        </Flex>
        <IconChevron className="expander__chevron" />
      </Flex>
      <div id="expander__body" className="expander__body">
        {children}
      </div>

      <Button
        id="expander__body__button"
        className="expander__body__button"
        onClick={closeAccordion}
      >
        <IconChevron className="expander__chevron" />
      </Button>
    </View>
  );
};
