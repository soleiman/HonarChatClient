import { animate, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, OnInit, ViewChild, AfterViewInit  } from '@angular/core';
import { ChatApiService } from 'src/app/@chat-app/services/chat-api.service';
import { GroupApiService } from 'src/app/@chat-app/services/group-api.service';
import { SocketApiService } from 'src/app/@chat-app/services/socket-api.service';
import { StorageService } from 'src/app/services/storage.service';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { ToLocalJalaliDatePipe } from 'src/app/@chat-app/pipes/to-local-jalali-date.pipe';
import { ToLocalTimePipe } from 'src/app/@chat-app/pipes/to-local-time.pipe';
import { ToGroupNamePipe } from 'src/app/@chat-app/pipes/to-group-name.pipe';
import { ToGroupImagePipe } from 'src/app/@chat-app/pipes/to-group-image.pipe';
import { ToUserFullNamePipe } from 'src/app/@chat-app/pipes/to-user-full-name.pipe';
import { ToUserProfileImagePipe } from 'src/app/@chat-app/pipes/to-user-profile-image.pipe';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-chat-area-group',
  templateUrl: './chat-area-group.component.html',
  styleUrls: ['./chat-area-group.component.scss'],
  standalone: true,
  imports:[
    CommonModule,
    FormsModule,
    FontAwesomeModule,
    ToUserProfileImagePipe,
    ToUserFullNamePipe,
    ToGroupImagePipe,
    ToGroupNamePipe,
    ToLocalJalaliDatePipe,
    ToLocalTimePipe
  ],
  providers: [
    DatePipe
  ],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: '0' }),
        animate('.5s ease-out', style({ opacity: '1' })),
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
export class ChatAreaGroupComponent implements OnInit, AfterViewInit {
  @ViewChild('chatbody', { static: false }) chatBody: ElementRef<HTMLDivElement> = {} as ElementRef;

  messages: any;
  msg: any = null;
  user: any;
  txtMsg = '';
  scrollTop: number = 0;
  groupMembers: any;

  faAngleRight = faAngleRight;
  online_users = 0;
  members_count = 0;
  constructor(private chatApiService: ChatApiService, 
    private storage: StorageService,
    private socket: SocketApiService,
    private groupApiService: GroupApiService,
    private datepipe: DatePipe) {
    this.storage.getUser().subscribe(user => this.user = user);
  }

  ngAfterViewInit(): void {
    this.scrollTop = this.chatBody.nativeElement.scrollHeight;
  }

  ngOnInit(): void {
    this.chatApiService.activeChat$.subscribe(msg => {
      this.msg = msg;
    });

    this.chatApiService.currentMessages$.subscribe((messages) => {
      this.messages = messages;

      console.log('messages:', messages);
    });

    this.socket.onUserJoined().subscribe({
      next: (data: any) => {
        console.log('[USER JOINED]:', data);
        this.online_users = data.online_count;
      },
      error: err => { console.log('ERR:', err); }
    });

    this.socket.onRecieveMsg().subscribe((msg: any) => {
      console.log('RCV MSG:', msg);

      this.chatApiService.fillChatList();

      let today = this.datepipe.transform(new Date(), 'yyyy-MM-dd');
      let todayMessages = this.messages.filter((obj:any) => {
        return obj._id === today;
      });
      if(todayMessages.length > 0) {
        todayMessages[0].list.push(msg);
        todayMessages[0].count += 1;
      }
      else {
        this.messages.push({
          _id: today,
          count: 1,
          list: [
            {
              body: msg.body,
              date: msg.date,
              recvId: msg.recvId,
              recvIsGroup: msg.recvIsGroup,
              sender: msg.sender,
              status: msg.status,
              _id: ""
            }
          ]
        });
      }

      // this.messages.push(msg);
      this.chatApiService.currentMessages$.next(this.messages);

      this.scrollTop = this.chatBody.nativeElement.scrollHeight;
    });

    this.groupApiService.getGroupMembers(this.msg.recvId).subscribe(members => {
      console.log("GRP MEMEBERS:", members);
      this.groupMembers = members;
      this.members_count = members.length;
    });
  }

  hideChatArea = () => {
    this.chatApiService.activeChatType$.next(0);
    this.socket.leaveChat(this.socket.activeRoomId, this.user.mobile_number, true);
  }

  sendMsg = () => {

    let newMsg = {
      body: this.txtMsg,
      date: Date.now(),
      recvId: this.msg.recvId,
      recvIsGroup: true,
      sender: this.user.mobile_number,
      status: 1,
      _id: ""
    };

    let today = this.datepipe.transform(new Date(), 'yyyy-MM-dd');
    let todayMessages = this.messages.filter((obj:any) => {
      return obj._id === today;
    });
    if(todayMessages.length > 0) {
      todayMessages[0].list.push(newMsg);
      todayMessages[0].count += 1;
    }
    else {
      this.messages.push({
        _id: today,
        count: 1,
        list: [
          {
            body: this.txtMsg,
            date: Date.now(),
            recvId: this.msg.recvId,
            recvIsGroup: true,
            sender: this.user.mobile_number,
            status: 1,
            _id: ""
          }
        ]
      });
    }


    this.socket.sendMessage(newMsg);
    this.chatApiService.currentMessages$.next(this.messages);
    this.txtMsg = '';
  }

}
