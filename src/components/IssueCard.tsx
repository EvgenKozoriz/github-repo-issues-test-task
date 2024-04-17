import { Card, CardBody, CardHeader, Heading, Text } from "@chakra-ui/react";
import { formatDistanceToNow } from "date-fns";
import React, { useRef } from "react";
import { DropTargetMonitor, XYCoord, useDrag, useDrop } from "react-dnd";
import { ColumnTypes, ItemTypes, dndItem } from "../types/dndTypes";
import useStore from "../store/issuesStore";

interface CardProps {
  id: number;
  index: number;
  title: string;
  number: number;
  date: string;
  userLogin: string;
  commentsNum: number;
  column: ColumnTypes;
}

const IssueCard: React.FC<CardProps> = ({
  id,
  index,
  title,
  number,
  date,
  userLogin,
  commentsNum,
  column,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const changeOrder = useStore((state) => state.changeOrder);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.CARD,
    
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
    hover: (item: dndItem, monitor: DropTargetMonitor<unknown, unknown>) => {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }
      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      const clientOffset = monitor.getClientOffset();

      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      changeOrder(dragIndex, item.column, column, hoverIndex);
      item.index = hoverIndex;
    },
  }));

  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.CARD,
    item: {
      type: ItemTypes.CARD,
      id,
      title,
      index,
      column,
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const createdDate = new Date(date);
  const distance = formatDistanceToNow(createdDate);
  const formattedDate =
    distance === "less than a day" ? "today" : `${distance} ago`;

  drag(drop(ref));

  return (
    <Card
      ref={ref}
      background={isOver ? "tomato" : "blue.300"}
      rounded="4"
      p={4}
      color="white"
      maxWidth="290px"
      mb={2}
      opacity={isDragging ? 0.5 : 1}
    >
      <CardHeader p="0 5px">
        <Heading size="md">{title}</Heading>
      </CardHeader>
      <CardBody p="5px">
        <Text>{`#${number} opened ${formattedDate}`}</Text>
        <Text>{`${userLogin} | Comments : ${commentsNum}`}</Text>
      </CardBody>
    </Card>
  );
};

export default IssueCard;
