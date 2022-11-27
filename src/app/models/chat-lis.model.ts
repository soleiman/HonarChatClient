import { Group } from "./group.model";
import { User } from "./user.model";

export class ChatList {
  name: string;
  lastMessage: string;
  lastMessageTime: string;
  isGroup: boolean;
  group: Group;
  prvUser: User;
  unread: number;


  constructor(unread: number, name: string, lastMessage: string,
    isGroup: boolean, group: Group,
    prvUser: User, lastMessageTime: string) {

    this.name = name;
    this.unread = unread;
    this.lastMessage = lastMessage;
    this.isGroup = isGroup;
    this.group = group;
    this.prvUser = prvUser;
    this.lastMessageTime = lastMessageTime;
  }

}
