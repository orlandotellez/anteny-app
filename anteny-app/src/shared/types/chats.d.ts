import { IOtherUser, IUser } from "./user";

export interface IChatItem extends IUser {
  message: string;
  time: string;
  unread?: number;
}

export interface IChatData {
  name: string;
  otherUser?: IOtherUser
  isDirect: boolean;
}
