import { Center, Spinner as ChakraSpinner } from "@chakra-ui/react";

const Spinner = () => {
  return (
    <Center>
      <ChakraSpinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="blue.500"
        size="xl"
      />
    </Center>
  );
};

export default Spinner;
