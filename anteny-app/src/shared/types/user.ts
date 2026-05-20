export interface IUser {
  id: string;
  name: string;
  avatar?: string;
  status: string;
  isOnline?: boolean;
}

export interface IUserProfile {
  id: string;
  displayName: string;
  avatar?: string;
  status: string;
  isOnline?: boolean;
}

export interface IOtherUser {
  user_id: string;
  displayname: string
}
