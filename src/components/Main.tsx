import { Box, Button, Flex, Input } from "@chakra-ui/react";
import useStore from "../store/issuesStore";
import Spinner from "./Spinner";
import ErrorAlert from "./ErrorAlert";
import BreadCrumbs from "./BreadCrumbs";
import Column from "./Column";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import IssueCard from "./IssueCard";
import { Columns } from "../types/issue";

const Main = () => {
  const {
    issues,
    loading,
    validateError,
    fetchError,
    inputText,
    fetchIssues,
    setInputText,
    validateInputText,
    makeBreadCrumbs,
  } = useStore();

  const handleButtonClick = async () => {
    validateInputText();
    makeBreadCrumbs();
    await fetchIssues();
  };

  const columns:Columns[] = [
    {
      id: 'todo',
      header: 'ToDo:'
    },
      {
      id: 'inProgress',
      header: 'In progress:'
    },  
    {
      id: 'done',
      header: 'Done:'
    },

  ]

  return (
    <Box backgroundColor="blue.100" minH="calc(100vh - 107px)">
      {validateError && (
        <ErrorAlert alertType={"Validate"} description={validateError} />
      )}
      {fetchError && (
        <ErrorAlert alertType={"Fetch"} description={fetchError} />
      )}
      <Box mx="auto" maxW="1024px">
        <Flex mb={4} pt={4} gap={2}>
          <Input
            placeholder="Enter repo URL"
            size="lg"
            flexGrow={1}
            onChange={(e) => setInputText(e.target.value)}
            value={inputText}
          />
          <Button colorScheme="blue" size="lg" onClick={handleButtonClick}>
            Load issues
          </Button>
        </Flex>
        {loading && <Spinner />}
        <BreadCrumbs />
        <Flex wrap="wrap" gap="2" justify="space-between" rounded="4" py={4}>
          <DndProvider backend={HTML5Backend}>
            {columns.map(column => (
              <Column key={column.id} header={column.header} column={column.id}>
              {issues[column.id].map((issue, index) => (
                <IssueCard
                  column={column.id}
                  index={index}
                  id={issue.id}
                  key={issue.id}
                  title={issue.title}
                  number={issue.number}
                  date={issue.date}
                  userLogin={issue.userLogin}
                  commentsNum={issue.commentsNum}
                />
              ))}
            </Column>
            ))}
          </DndProvider>
        </Flex>
      </Box>
    </Box>
  );
};

export default Main;
