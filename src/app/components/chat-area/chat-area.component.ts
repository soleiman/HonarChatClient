import { Component, OnInit } from '@angular/core';
import { ChatApiService } from 'src/app/services/chat-api.service';
import { SocketApiService } from 'src/app/services/socket-api.service';

@Component({
  selector: 'app-chat-area',
  templateUrl: './chat-area.component.html',
  styleUrls: ['./chat-area.component.scss']
})
export class ChatAreaComponent implements OnInit {
  activeChatType: number = 0;
  constructor(private socket: SocketApiService, private chatApiService: ChatApiService) {

  }

  ngOnInit(): void {
    this.socket.onNewMessage().subscribe((data) => {
      console.log('NEW MSG:', data);
      this.chatApiService.fillChatList();
    });

    this.chatApiService.activeChatType$.subscribe((activeChatType: number) => {
      this.activeChatType = activeChatType;
    });

    this.chatApiService.currentMessages$.subscribe((messages) => {
      console.log("[PRV MESSAGES]:", messages);
    });
  }
}
