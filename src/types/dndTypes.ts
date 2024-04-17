export enum ItemTypes {
  CARD = "card",
}

export type ColumnTypes = "todo" | "inProgress" | "done";

export interface dndItem {
  type: ItemTypes;
  id: number;
  title: string;
  index: number;
  column: ColumnTypes;
}
