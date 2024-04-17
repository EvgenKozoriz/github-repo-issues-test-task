import { Box, Heading } from "@chakra-ui/react";


const Header = () => {
  return (
    <Box background="blue.500" color="white" p={4}>
      <Box mx="auto" maxW="1024px">
        <Heading fontSize="lg">GitHub Repo Issues</Heading>
      </Box>
    </Box>
  );
};

export default Header;
