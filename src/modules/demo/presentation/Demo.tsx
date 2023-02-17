import { useState } from "react";

import { VStack, Text, Heading, Center, Button } from "@chakra-ui/react";

import { t } from "utils";

const Demo = () => {
  const [count, setCount] = useState(0);

  return (
    <Center>
      <VStack>
        <Heading fontWeight="900">{t("Vite + React")}</Heading>
        <VStack>
          <Button onClick={() => setCount((count) => count + 1)}>
            {t(`count is {count}`, { count })}
          </Button>
          <Text fontWeight="700">
            {t(`Edit {path} and save to test HMR`, {
              path: <code>src/App.tsx</code>,
            })}
          </Text>
        </VStack>
        <Text fontWeight="400">
          {t("Click on the Vite and React logos to learn more")}
        </Text>
        <Text fontWeight="400">{new Date().toJSON()}</Text>
      </VStack>
    </Center>
  );
};

export { Demo };
