import * as React from 'react';

export interface BlockSwitcherContextInterface {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const BlockSwitcherContext =
  React.createContext<BlockSwitcherContextInterface>({
    activeTab: '',
    setActiveTab: () => {}
  });
