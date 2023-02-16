import { useState } from "react";

import { VStack, Text, Heading, Center, Button } from "@chakra-ui/react";

const Demo = () => {
  const [count, setCount] = useState(0);

  return (
    <Center>
      <VStack>
        <Heading fontWeight="900">Vite + React</Heading>
        <VStack>
          <Button onClick={() => setCount((count) => count + 1)}>
            count is {count}
          </Button>
          <Text fontWeight="700">
            Edit <code>src/App.tsx</code> and save to test HMR
          </Text>
        </VStack>
        <Text fontWeight="400">
          Click on the Vite and React logos to learn more
        </Text>
      </VStack>
    </Center>
  );
};

export { Demo };
