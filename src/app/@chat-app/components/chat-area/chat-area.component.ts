import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ChatApiService } from 'src/app/@chat-app/services/chat-api.service';
import { SocketApiService } from 'src/app/@chat-app/services/socket-api.service';
import { ChatAreaEmptyComponent } from './chat-area-empty/chat-area-empty.component';
import { ChatAreaGroupComponent } from './chat-area-group/chat-area-group.component';
import { ChatAreaPrivateComponent } from './chat-area-private/chat-area-private.component';

@Component({
  selector: 'app-chat-area',
  templateUrl: './chat-area.component.html',
  styleUrls: ['./chat-area.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ChatAreaEmptyComponent,
    ChatAreaGroupComponent,
    ChatAreaPrivateComponent
  ],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: '0' }),
        animate('.5s ease-out', style({ opacity: '1' })),
      ]),
    ]),
    trigger('fadeOut', [
      transition(':leave', [
        style({ opacity: '1' }),
        animate('.5s ease-out', style({ opacity: '0' })),
      ]),
    ]),
    trigger('slideIn', [
      transition(':enter', [
        style({transform: 'translateX(-100%)'}),
        animate('200ms ease-in', style({transform: 'translateX(0%)'}))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({transform: 'translateX(-100%)'}))
      ])
    ])
  ]
})
export class ChatAreaComponent implements OnInit {
  activeChatType: number = 0;

  constructor(private socket: SocketApiService, private chatApiService: ChatApiService) {

  }

  ngOnInit(): void {
    this.chatApiService.activeChatType$.subscribe((activeChatType: number) => {
      this.activeChatType = activeChatType;
    });
  }
}
