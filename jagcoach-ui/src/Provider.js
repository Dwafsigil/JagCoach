import React from 'react';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';

// Customize your Chakra UI theme (optional)
const customTheme = extendTheme({
  styles: {
    global: {
      body: {
        fontFamily: 'Arial, sans-serif',
        bg: 'gray.100',
        color: 'gray.800',
      },
    },
  },
});

const Provider= ({ children }) => {
  return <ChakraProvider theme={customTheme}>{children}</ChakraProvider>;
};

export default Provider;