import { useState } from "react";

import { VStack, Text, Heading, Center, Button } from "@chakra-ui/react";

import { Number, t } from "utils";

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
          {t("Vite had {number} weekly downloads on NPM in {date}", {
            number: Number.format("2696684.12"),
            date: new Date(2023, 2, 17, 10, 44, 0).toJSON(),
          })}
        </Text>
        <Text fontWeight="400">
          {t("{bitcoinNumber} bitcoins were worth {currencyNumber} in {date}", {
            bitcoinNumber: Number.format(1000),
            currencyNumber: Number.formatCurrency(23753382.63),
            date: new Date(2023, 2, 17, 10, 44, 0).toJSON(),
          })}
        </Text>
      </VStack>
    </Center>
  );
};

export { Demo };
