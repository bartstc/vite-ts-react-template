import { VStack, Text, Heading, Center, Button } from "@chakra-ui/react";

import { useCounter } from "@/features/demo/application/useCounter";
import { useFormatDate } from "@/lib/date/useFormatDate";
import { useFormatDateTime } from "@/lib/date/useFormatDateTime";
import { moneyVO } from "@/lib/format/Money";
import { numberVO } from "@/lib/format/Number";

const Demo = () => {
  const formatDate = useFormatDate();
  const formatDateTime = useFormatDateTime();

  const { count, increment } = useCounter();

  return (
    <Center>
      <VStack>
        <Heading fontWeight="900">{"Vite + React"}</Heading>
        <VStack>
          <Button onClick={() => increment()}>{`Count is ${count}`}</Button>
          <Text fontWeight="700">
            {`Edit src/App.tsx and save to test HMR`}
          </Text>
        </VStack>
        <Text fontWeight="400">
          {`Vite had ${numberVO.format("2696684.12")} weekly downloads on NPM in ${formatDate(new window.Date(2023, 1, 17, 10, 44, 0), { format: "long" })}`}
        </Text>
        <Text fontWeight="400">
          {`${numberVO.format(1000)} bitcoins were worth ${moneyVO.format(23753382.63, "USD")} on ${formatDateTime(new Date(2023, 1, 17, 12, 44, 0))}`}
        </Text>
      </VStack>
    </Center>
  );
};
export { Demo };
