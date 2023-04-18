import { Button } from "@chakra-ui/react";

import { t } from "utils";

const CheckoutButton = () => {
  return (
    <Button w="100%" colorScheme="orange" onClick={() => {}}>
      {t("Checkout")}
    </Button>
  );
};

export { CheckoutButton };
