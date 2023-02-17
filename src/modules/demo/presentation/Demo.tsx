import { useState } from "react";

import { VStack, Text, Heading, Center, Button } from "@chakra-ui/react";

import { Date, Number, t } from "utils";

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
          {t("Vite had {number} weekly downloads on NPM on {date}", {
            number: Number.format("2696684.12"),
            date: Date.formatDate(new window.Date(2023, 1, 17, 10, 44, 0)),
          })}
        </Text>
        <Text fontWeight="400">
          {t("{bitcoinNumber} bitcoins were worth {currencyNumber} on {date}", {
            bitcoinNumber: Number.format(1000),
            currencyNumber: Number.formatCurrency(23753382.63),
            date: Date.formatDateTime(new window.Date(2023, 1, 17, 12, 44, 0)),
          })}
        </Text>{" "}
        <Text fontWeight="400">
          {t("Storybook conference: {date}", {
            bitcoinNumber: Number.format(1000),
            currencyNumber: Number.formatCurrency(23753382.63),
            date: Date.formatRelativeTime(
              new window.Date(2023, 2, 14, 10, 0, 0)
            ),
          })}
        </Text>
      </VStack>
    </Center>
  );
};

export { Demo };
