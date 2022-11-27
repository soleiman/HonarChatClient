import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject  } from 'rxjs';
import { UserApiService } from './user-api.service';
import { environment } from '../../environment/environment';
import { ChatList } from '../models/chat-lis.model';
import { Message } from '../models/message.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ChatApiService implements OnInit{

  chatList$: BehaviorSubject<any[]> = new BehaviorSubject<any>(null);
  activeChatType$: Subject<number> = new Subject<number>();
  currentMessages$: Subject<any[]> = new Subject<any[]>();
  current_user: any;

  constructor(private httpClient: HttpClient, userApiService: UserApiService) {
    this.activeChatType$.next(0);
    userApiService.getCurrentUserObs().subscribe(user => {
      this.current_user = user;
      this.fillChatList();
    });
  }

  ngOnInit(): void {

  }

  fillMessages = (userId: String) => {
    this.getPrivateMessages(this.current_user.mobileNumber, userId).subscribe((msgs: any) => {
      this.currentMessages$.next(msgs);
    });
  }

  fillChatList = () => {
    this.getUserChatList(this.current_user.mobileNumber)
      .subscribe(msgs => {
        this.chatList$.next(msgs);
      });
  }

  getChatListObs(): Observable<ChatList[]> {
    return this.chatList$.asObservable();
  }

  setChatListObs(ChatList: ChatList[]) {
    this.chatList$.next(ChatList);
  }

  getUserMessages(mobileNumber: string) {
    return this.httpClient.get<Message[]>(environment.baseApiUrl + '/message/user-messsages-list/' + mobileNumber);
  }

  getUserChatList(mobileNumber: string) {
    return this.httpClient.get<Message[]>(environment.baseApiUrl + '/user/user-chat-list/' + mobileNumber);
  }

  checkPrivateRoom = (user: string, roomId: string) => {
    return this.httpClient.post(environment.baseApiUrl + '/rooms/check-prv-room', { user: user, roomId: roomId });
  }

  getPrivateMessages = (user: String, target: String) => {
    return this.httpClient.get(environment.baseApiUrl + '/message/private-messsages/' + target + '/' + user);
  }
}
