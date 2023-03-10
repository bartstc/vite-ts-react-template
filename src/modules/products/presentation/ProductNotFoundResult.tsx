import { Button, ButtonGroup } from "@chakra-ui/react";

import { t } from "utils";

import { ContactUsButton, Result, WarningIcon } from "shared/Result";
import { useNavigate } from "shared/Router";

const ProductNotFoundResult = () => {
  const navigate = useNavigate();

  return (
    <Result
      image={<WarningIcon />}
      heading={t("Product doesn't exist")}
      subheading={t(
        "Probably this product is no more for a sale or you just got here by accident. If you think there is something wrong on our side, please contact us!"
      )}
    >
      <ButtonGroup>
        <ContactUsButton />
        <Button onClick={() => navigate("/products")}>
          {t("Back to products' list")}
        </Button>
      </ButtonGroup>
    </Result>
  );
};

export { ProductNotFoundResult };
