import { View, Flex } from '@aws-amplify/ui-react';

interface BlockProps {
  name: string;
  children: React.ReactNode;
}

export const Block = ({ children }: BlockProps) => {
  return <Flex className="block">{children}</Flex>;
};
