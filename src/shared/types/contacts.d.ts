export type IContactItem =
  | ActionItem
  | HeaderItem
  | LetterItem
  | PersonItem;

export interface BaseItem {
  id: string;
}

export interface ActionItem extends BaseItem {
  type: "action";
  title: string;
  icon: string;
}

export interface HeaderItem extends BaseItem {
  type: "header";
  title: string;
}

export interface LetterItem extends BaseItem {
  type: "letter";
  title: string;
}

export interface PersonItem extends BaseItem {
  type?: "person";
  name: string;
  status: string;
  avatar?: string;
}
