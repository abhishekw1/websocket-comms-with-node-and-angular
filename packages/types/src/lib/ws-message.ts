import { User } from './user';

export type WsMessgae =
  | ChatMessage
  | ChatRealyMessgae
  | SystemNotice
  | LoginMessage
  | UserListMessage;

export interface ChatMessage {
  event: 'chat';
  contents: string;
}

export interface ChatRealyMessgae {
  event: 'chatRelay';
  contents: string;
  author: User;
}

export interface SystemNotice {
  event: 'systemNotice';
  contents: string;
}

export interface LoginMessage {
  event: 'login';
  user: User;
}

export interface UserListMessage {
  event: 'userList';
  users: User[];
}
