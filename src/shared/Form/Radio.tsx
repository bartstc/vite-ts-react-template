import { Radio as ChakraRadio, RadioProps } from "@chakra-ui/react";

interface IProps extends RadioProps {}

const Radio = (props: IProps) => {
  return <ChakraRadio {...props} />;
};

export { Radio };
