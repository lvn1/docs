import { useState, useMemo, Children, isValidElement } from 'react';
import { Flex, View, Button } from '@aws-amplify/ui-react';
import classNames from 'classnames';
interface TabButton {
  name: string;
  tab: string;
  id: string;
}

interface TabPanel {
  button: string;
  id: string;
  children: React.ReactNode;
}

interface BlockSwitcherProps {
  children: React.ReactNode;
}

function getIdFromName(name: string) {
  return name?.replace(/\s+/g, '-').toLowerCase();
}

export const BlockSwitcher = ({ children }: BlockSwitcherProps) => {
  const [activeTab, setActiveTab] = useState('');

  const tabButtons = useMemo(() => {
    const tabButtonsArray: TabButton[] = [];

    Children.toArray(children).forEach((child) => {
      if (isValidElement(child)) {
        const { name } = child.props;
        const tabId = 'tab-' + getIdFromName(name);
        const id = 'tab-button-' + getIdFromName(name);
        tabButtonsArray.push({
          name,
          tab: tabId,
          id
        });
      }
    });
    return tabButtonsArray;
  }, [children]);

  const tabPanels = useMemo(() => {
    const tabPanelsArray: TabPanel[] = [];
    Children.toArray(children).forEach((child) => {
      if (isValidElement(child)) {
        const { name, children } = child.props;
        const tabButtonId = 'tab-button-' + getIdFromName(name);
        const id = 'tab-' + getIdFromName(name);
        tabPanelsArray.push({
          button: tabButtonId,
          id,
          children
        });
      }
    });
    return tabPanelsArray;
  }, [children]);

  const value = useMemo(
    () => ({
      activeTab,
      setActiveTab
    }),
    [activeTab, setActiveTab]
  );

  return (
    <View className="block-switcher">
      <Flex className="block-switcher__tab-list" role="tablist">
        {tabButtons.map(({ name, id, tab }, index) => {
          return (
            <Button
              role="tab"
              key={`tab-button-${index}`}
              aria-selected={activeTab === tab}
              aria-controls={tab}
              id={id}
              className={classNames('block-switcher__tab-button', {
                'block-switcher__tab-button--active': activeTab === tab
              })}
              tabIndex={activeTab != tab ? -1 : 0}
              onClick={() => setActiveTab(tab)}
            >
              {name}
            </Button>
          );
        })}
      </Flex>
      {tabPanels.map(({ button, id, children }, index) => {
        return (
          <Flex
            key={`tab-panel-${index}`}
            id={id}
            className={classNames('block-switcher__tab-panel', {
              'block-switcher__tab-panel--active': activeTab === id
            })}
            aria-labelledby={button}
            role="tabpanel"
          >
            {children}
          </Flex>
        );
      })}
    </View>
  );
};
