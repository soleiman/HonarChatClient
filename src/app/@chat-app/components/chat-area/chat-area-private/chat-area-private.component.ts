import { animate, style, transition, trigger } from '@angular/animations';
import { Component, ElementRef, OnInit, ViewChild, AfterViewInit  } from '@angular/core';
import { ChatApiService } from 'src/app/@chat-app/services/chat-api.service';
import { SocketApiService } from 'src/app/@chat-app/services/socket-api.service';
import { StorageService } from 'src/app/services/storage.service';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { ToUserProfileImagePipe } from 'src/app/@chat-app/pipes/to-user-profile-image.pipe';
import { ToUserFullNamePipe } from 'src/app/@chat-app/pipes/to-user-full-name.pipe';
import { ToGroupImagePipe } from 'src/app/@chat-app/pipes/to-group-image.pipe';
import { ToGroupNamePipe } from 'src/app/@chat-app/pipes/to-group-name.pipe';
import { ToLocalJalaliDatePipe } from 'src/app/@chat-app/pipes/to-local-jalali-date.pipe';
import { ToLocalTimePipe } from 'src/app/@chat-app/pipes/to-local-time.pipe';
import { CommonModule, DatePipe } from '@angular/common';
import { InView } from 'src/app/@chat-app/directives/in-view.directive';
import { v4 as uuid } from 'uuid';

@Component({
  selector: 'app-chat-area-private',
  templateUrl: './chat-area-private.component.html',
  styleUrls: ['./chat-area-private.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FontAwesomeModule,
    ToUserProfileImagePipe,
    ToUserFullNamePipe,
    ToGroupImagePipe,
    ToGroupNamePipe,
    ToLocalJalaliDatePipe,
    ToLocalTimePipe,
    InView
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
export class ChatAreaPrivateComponent implements OnInit, AfterViewInit {

  @ViewChild('chatbody', { static: false }) chatBody: ElementRef<HTMLDivElement> = {} as ElementRef;

  messages: any;
  msg: any = null;
  user: any;
  txtMsg = '';
  scrollTop: number = 0;


  faAngleRight = faAngleRight;

  userStatus = 'avatar-offline';

  constructor(private chatApiService: ChatApiService, 
    private storage: StorageService,
    private socket: SocketApiService,
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
      console.log("[MSGS]:", messages);
      this.messages = messages;
    });

    this.socket.onUserJoined().subscribe({
      next: (data: any) => {
        console.log('[USER JOINED]:', data);
        if(data.user_id !== this.user.mobile_number) {
          this.userStatus = 'avatar-online';
        }

        for(let al_user of data.already_joined_user) {
          if(al_user !== this.user.mobile_number)
            this.userStatus = 'avatar-online';
        }
      },
      error: err => { console.log('ERR:', err); }
    });

    this.socket.onUserLeft().subscribe({
      next: (data:any) => {
        console.log('[USER LEFT]:', data);
        this.userStatus = 'avatar-offline';
      },
      error: err => { console.log('ERR:', err); }
    })

    //onNewMessage
    this.socket.onRecieveMsg().subscribe((newMsg: any) => {
      console.log('RCV MSG:', newMsg);
      //this.chatApiService.fillChatList();

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
              body: newMsg.body,
              date: newMsg.date,
              recvId: newMsg.recvId,
              recvIsGroup: newMsg.recvIsGroup,
              sender: newMsg.sender,
              status: newMsg.status,
              _id: newMsg._id
            }
          ]
        });
      }

      //this.messages.push(newMsg);
      this.chatApiService.currentMessages$.next(this.messages);

      this.scrollTop = this.chatBody.nativeElement.scrollHeight;  
    });

    this.socket.onMsgStatusChanged().subscribe((msg: any) => {
      console.log('[msg_status_changed]:', msg);
      for(let index in this.messages){
        let statusChanged= false;
        if(this.messages[index].count > 0){
          debugger;
          let objIndex = this.messages[index].list.findIndex(((obj: any) => obj._id === msg.msgId));

          if(objIndex > 0) {
            this.messages[index].list[objIndex].status = msg.status;
            statusChanged = true;
            this.chatApiService.currentMessages$.next(this.messages);
          }
        }

        if(statusChanged)
          break;
      }
    });
  }

  hideChatArea = () => {
    this.chatApiService.activeChatType$.next(0);
    this.socket.leaveChat(this.socket.activeRoomId, this.user.mobile_number, false);
  }

  sendMsg = () => {

    let newMsg = {
      body: this.txtMsg,
      date: Date.now(),
      recvId: this.msg.sender,
      recvIsGroup: false,
      sender: this.user.mobile_number,
      status: 1,
      _id: "",
      clientId: uuid()
    };

    // let today = this.datepipe.transform(new Date(), 'yyyy-MM-dd');
    // let todayMessages = this.messages.filter((obj:any) => {
    //   return obj._id === today;
    // });
    // if(todayMessages.length > 0) {
    //   todayMessages[0].list.push(newMsg);
    //   todayMessages[0].count += 1;
    // }
    // else {
    //   this.messages.push({
    //     _id: today,
    //     count: 1,
    //     list: [
    //       {
    //         body: this.txtMsg,
    //         date: Date.now(),
    //         recvId: this.msg.sender,
    //         recvIsGroup: false,
    //         sender: this.user.mobile_number,
    //         status: 1,
    //         _id: ""
    //       }
    //     ]
    //   });
    // }

    this.socket.sendMessage(newMsg);
    //this.chatApiService.currentMessages$.next(this.messages);
    this.txtMsg = '';
  }
}