import { Component, OnInit } from '@angular/core';
import { faComments } from '@fortawesome/free-regular-svg-icons';
import { Message } from 'src/app/models/message.model';
import { ChatApiService } from 'src/app/@chat-app/services/chat-api.service';
import { SocketApiService } from 'src/app/@chat-app/services/socket-api.service';
import { StorageService } from 'src/app/services/storage.service';
import { ToUserProfileImagePipe } from 'src/app/@chat-app/pipes/to-user-profile-image.pipe';
import { ToUserFullNamePipe } from 'src/app/@chat-app/pipes/to-user-full-name.pipe';
import { ToGroupImagePipe } from 'src/app/@chat-app/pipes/to-group-image.pipe';
import { ToGroupNamePipe } from 'src/app/@chat-app/pipes/to-group-name.pipe';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ToUserProfileImagePipe,
    ToUserFullNamePipe,
    ToGroupImagePipe,
    ToGroupNamePipe
  ]
})
export class ChatListComponent implements OnInit{

  messages: Message[] = [];

  faComments = faComments;

  user: any;

  constructor(private chatApiService: ChatApiService, private socket: SocketApiService
    , private storage: StorageService) {
    this.storage.getUser().subscribe(user => this.user = user);
  }

  ngOnInit(): void {
      this.chatApiService.chatList$.subscribe(msgs=> {
        this.messages = msgs;
      });

      this.socket.onNewMessage().subscribe(msg => {
        console.log('[fillChatList]');
        this.chatApiService.fillChatList();
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
        this.socket.joinChat(roomInfo.roomId, this.user.mobile_number, false);
        this.socket.activeRoomId$.next(roomInfo.roomId);
        this.socket.activeRoomId = roomInfo.roomId;
        this.chatApiService.fillMessages(msg.sender);
        this.showMessageArea(msg);
      });
    }
    else {
      this.socket.joinChat(msg.recvId, this.user.mobile_number, true);
      this.socket.activeRoomId = msg.recvId;
      this.socket.activeRoomId$.next(msg.recvId);
      this.chatApiService.fillGroupMessages(msg.recvId);
      this.showMessageArea(msg);
    }
  }

  showMessageArea = (msg: any) => {
    if(msg.recvIsGroup)
      this.chatApiService.activeChatType$.next(2); // group
    else
      this.chatApiService.activeChatType$.next(1); // private

    this.chatApiService.activeChat$.next(msg);
  }
}
