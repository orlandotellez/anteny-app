import { IContactItem } from "../types/contacts";
import { users } from "./users";

export const contacts: IContactItem[] = [
  ...users.map((user) => ({
    id: user.id,
    type: "person" as const,
    name: user.name,
    status: user.status,
    avatar: user.avatar,
  })),
];