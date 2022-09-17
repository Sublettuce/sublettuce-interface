import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import { Button } from '@mantine/core';

const Home: NextPage = () => {
  return (
    <div>
        <ConnectButton />
        <Button>Test</Button>
    </div>
  );
};

export default Home;
