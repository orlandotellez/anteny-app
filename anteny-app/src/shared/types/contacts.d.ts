import { IUser } from "./user";

export type IContactItem =
  | ActionItem
  | HeaderItem
  | LetterItem
  | PersonItem;

export interface BaseItem {
  id: string;
}

export interface PersonItem extends BaseItem, IUser {
  type?: "person";
}

export interface ActionItem {
  id: string
  type: "action";
  title: string;
  icon: any;
  action: () => void
}

