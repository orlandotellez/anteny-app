import { IChatItem } from "../types/chats";
import { users } from "./users";

export const chats: IChatItem[] = users.map((user) => ({
  ...user,
  message: "Hey! How are you doing?",
  time: "10:30 AM",
  unread: Math.floor(Math.random() * 5),
}));
