import { useState } from "react";

import { VStack, Text, Heading, Center, Button } from "@chakra-ui/react";

import { DateVO, numberVO, moneyVO, t } from "utils";

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
            number: numberVO.format("2696684.12"),
            date: DateVO.formatDate(new window.Date(2023, 1, 17, 10, 44, 0)),
          })}
        </Text>
        <Text fontWeight="400">
          {t("{bitcoinNumber} bitcoins were worth {currencyNumber} on {date}", {
            bitcoinNumber: numberVO.format(1000),
            currencyNumber: moneyVO.format(23753382.63, "USD"),
            date: DateVO.formatDateTime(new Date(2023, 1, 17, 12, 44, 0)),
          })}
        </Text>{" "}
        <Text fontWeight="400">
          {t("Storybook conference: {date}", {
            date: DateVO.formatRelativeTime(
              DateVO.generateDate(
                DateVO.buildDate("2023-02-17").set("hour", 12).set("minute", 44)
              )
            ),
          })}
        </Text>
      </VStack>
    </Center>
  );
};
export { Demo };
