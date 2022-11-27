import { Component, OnInit } from '@angular/core';
import { faComments } from '@fortawesome/free-regular-svg-icons';
import { Message } from 'src/app/models/message.model';
import { ChatApiService } from 'src/app/services/chat-api.service';
import { SocketApiService } from 'src/app/services/socket-api.service';


@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss']
})
export class ChatListComponent implements OnInit{

  messages: Message[] = [];

  faComments = faComments;

  constructor(private chatApiService: ChatApiService, private socket: SocketApiService) {
  }

  ngOnInit(): void {
      this.chatApiService.chatList$.subscribe(msgs=> {
        this.messages = msgs;

        console.log("[MESSAGES]:", this.messages);
      });
  }

  toDate = (dateStr: string) => {
    let cDate = new Date(dateStr);
    return cDate.toLocaleString('fa');
  }

  toLocalTime = (date: Date) => {
    let cDate = new Date(date);
    return cDate.toLocaleTimeString('fa');
  }

  joinChat = (msg: any) => {
    if(!msg.recvIsGroup) {
      this.chatApiService.checkPrivateRoom(msg.sender, msg.recvId).subscribe((roomInfo:any) => {
        this.socket.joinChat(roomInfo.roomId);
        this.socket.activeRoomId = roomInfo.roomId;
        this.chatApiService.fillMessages(msg.sender);
        this.showMessageArea(msg);
      });
    }
  }

  showMessageArea = (msg: any) => {
    if(msg.recvIsGroup)
      this.chatApiService.activeChatType$.next(2); // group
    else
      this.chatApiService.activeChatType$.next(1); // private
    console.log(msg);
  }
}
