import { IUser } from "./user";

export interface IChatItem extends IUser {
  message: string;
  time: string;
  unread?: number;
}
