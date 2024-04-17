import { Box, Heading } from "@chakra-ui/react";
import React, { ReactNode } from "react";
import { useDrop } from "react-dnd";
import { ColumnTypes, ItemTypes, dndItem } from "../types/dndTypes";
import useStore from "../store/issuesStore";

interface ColumnProps {
  header: string;
  children: ReactNode;
  column: ColumnTypes;
}

const Column: React.FC<ColumnProps> = ({
  header,
  children,
  column,
}) => {
  const moveIssue = useStore((state) => state.moveIssue);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.CARD,
    drop: (item: dndItem) => {
      const issueId = item.id;
      const fromColumn =item.column
      moveIssue(issueId, fromColumn, column);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <Box
      ref={drop}
      w="1/3"
      background={isOver ? "gray.400" : "blue.200"}
      rounded="4"
      p={4}
      minW="300px"
    >
      <Heading>{header}</Heading>
      {children}
    </Box>
  );
};

export default Column;
