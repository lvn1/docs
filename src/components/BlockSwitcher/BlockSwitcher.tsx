import {
  useState,
  useEffect,
  createElement,
  useMemo,
  Children,
  isValidElement
} from 'react';
import { Flex, View, Button } from '@aws-amplify/ui-react';
import { BlockSwitcherContext } from './BlockSwitcherContext';

interface TabButton {
  name: string;
  tab: string;
}

interface BlockSwitcherProps {
  children: React.ReactNode;
}

export const BlockSwitcher = ({ children }: BlockSwitcherProps) => {
  const [activeTab, setActiveTab] = useState('');

  const tabButtons = useMemo(() => {
    const tabButtonsArray: TabButton[] = [];

    Children.toArray(children).forEach((child) => {
      if (isValidElement(child)) {
        const { name } = child.props;
        const tabId = 'tab-' + name?.replace(/\s+/g, '-').toLowerCase();
        tabButtonsArray.push({
          name,
          tab: tabId
        });
      }
    });
    return tabButtonsArray;
  }, [children]);

  const value = useMemo(
    () => ({
      activeTab,
      setActiveTab
    }),
    [activeTab, setActiveTab]
  );

  return (
    <BlockSwitcherContext.Provider value={value}>
      <View className="block-switcher">
        <Flex className="block-switcher__tab-list" role="tablist">
          {tabButtons.map(({ name, tab }) => {
            return (
              <Button
                role="tab"
                aria-selected={activeTab === tab}
                aria-controls={tab}
                tabIndex={activeTab != tab ? -1 : 0}
                onClick={() => setActiveTab(tab)}
              >
                {name}
              </Button>
            );
          })}
        </Flex>
        {children}
      </View>
    </BlockSwitcherContext.Provider>
  );
};
