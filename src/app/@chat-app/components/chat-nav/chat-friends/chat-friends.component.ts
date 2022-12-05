import { animate, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { Contact } from 'src/app/models/contact.model';
import { ContactApiService } from 'src/app/@chat-app/services/contact-api.service';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { faBan, faEdit, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';
import { ChatApiService } from 'src/app/@chat-app/services/chat-api.service';
import { SocketApiService } from 'src/app/@chat-app/services/socket-api.service';
import { StorageService } from 'src/app/services/storage.service';
import { CreateContactComponent } from './create-contact/create-contact.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';
import { ToUserProfileImagePipe } from 'src/app/@chat-app/pipes/to-user-profile-image.pipe';
import { ToUserFullNamePipe } from 'src/app/@chat-app/pipes/to-user-full-name.pipe';

@Component({
  selector: 'app-chat-friends',
  templateUrl: './chat-friends.component.html',
  styleUrls: ['./chat-friends.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule,
    CreateContactComponent,
    ToUserProfileImagePipe,
    ToUserFullNamePipe
  ],
  providers: [
    SocketApiService,
    ContactApiService,
    ChatApiService
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
export class ChatFriendsComponent {

  contacts: Contact[] = [];
  faTrash = faTrashCan;
  faBan = faBan;
  faEdit = faEdit;
  faPaperPlane = faPaperPlane;
  user: any;

  constructor(private contactApi: ContactApiService, 
    private toastr: ToastrService,
    private chatApiService: ChatApiService,
    private socket: SocketApiService,
    private storage: StorageService) {
    this.contactApi.contactList$.subscribe(contacts => {
      this.contacts = contacts;
    });

    this.storage.getUser().subscribe(user => this.user = user);
  }

  toDate = (dateStr: string) => {
    let cDate = new Date(dateStr);
    return cDate.toLocaleString('fa');
  }

  deleteContact = (mobile_number: String): void => {

    this.contacts = this.contacts.filter((con) => {
      return con.mobile_number !== mobile_number
    });

    this.contactApi.contactList$.next(this.contacts);

    this.toastr.success('مخاطب با موفقیت حذف شد.');
  }

  joinChat = (mobile_number: String) => {
    // let msg = {
    //   body: '',
    //   date: Date.now(),
    //   recvId: '',
    //   recvIsGroup: false,
    //   sender: mobile_number,
    //   status: 1,
    //   _id: ""
    // };

    // this.chatApiService.checkPrivateRoom(msg.sender.toString(), msg.recvId).subscribe((roomInfo:any) => {
    //   this.socket.joinChat(roomInfo.roomId, this.user.mobile_number, false);
    //   this.socket.activeRoomId$.next(roomInfo.roomId);
    //   this.socket.activeRoomId = roomInfo.roomId;
    //   this.chatApiService.fillMessages(msg.sender);
    //   this.showMessageArea(msg);
    // });

    // this.chatApiService.checkPrivateRoom(msg.sender.toString(), msg.recvId).subscribe((roomInfo:any) => {
    //   this.socket.joinChat(roomInfo.roomId, this.user.mobile_number, false);
    //   this.socket.activeRoomId = roomInfo.roomId;
    //   this.chatApiService.fillMessages(msg.sender);
    //   this.showMessageArea(msg);
    // });
  }

  
  showMessageArea = (msg: any) => {
    if(msg.recvIsGroup)
      this.chatApiService.activeChatType$.next(2); // group
    else
      this.chatApiService.activeChatType$.next(1); // private

    this.chatApiService.activeChat$.next(msg);
  }
}
