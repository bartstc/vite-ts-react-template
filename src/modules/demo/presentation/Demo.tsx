import { VStack, Text, Heading, Center, Button } from "@chakra-ui/react";

import { numberVO, moneyVO, t, dateVO } from "utils";

import { useCounter } from "../application";

const Demo = () => {
  const { count, increment } = useCounter();

  return (
    <Center>
      <VStack>
        <Heading fontWeight="900">{t("Vite + React")}</Heading>
        <VStack>
          <Button onClick={() => increment()}>
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
            date: dateVO.formatDate(new window.Date(2023, 1, 17, 10, 44, 0)),
          })}
        </Text>
        <Text fontWeight="400">
          {t("{bitcoinNumber} bitcoins were worth {currencyNumber} on {date}", {
            bitcoinNumber: numberVO.format(1000),
            currencyNumber: moneyVO.format(23753382.63, "USD"),
            date: dateVO.formatDateTime(new Date(2023, 1, 17, 12, 44, 0)),
          })}
        </Text>{" "}
        <Text fontWeight="400">
          {t("Storybook conference: {date}", {
            date: dateVO.formatRelativeTime(
              dateVO.given(new Date(2023, 1, 17, 12, 44, 0))
            ),
          })}
        </Text>
      </VStack>
    </Center>
  );
};
export { Demo };
