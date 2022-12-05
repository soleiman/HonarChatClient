import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject  } from 'rxjs';
import { environment } from '../../../environment/environment';
import { ChatList } from '../../models/chat-lis.model';
import { Message } from '../../models/message.model';
import { StorageService } from '../../services/storage.service';

@Injectable()
export class ChatApiService implements OnInit{

  chatList$: BehaviorSubject<any[]> = new BehaviorSubject<any>(null);
  activeChatType$: Subject<number> = new Subject<number>();
  activeChat$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  currentMessages$: Subject<any[]> = new Subject<any[]>();
  current_user: any;

  constructor(private httpClient: HttpClient, private storage: StorageService) {
    this.activeChatType$.next(0);
    this.storage.currentUser$.subscribe(user => {
      console.log("[ChatAPI|USER]:", user);
      if(user) {
        this.current_user = user;
        this.fillChatList();
      }
    });
  }

  ngOnInit(): void {
    
  }

  getcurrentMessages(): Observable<any[]> {
    return this.currentMessages$.asObservable();
  }

  fillMessages = (userId: String) => {
    this.getPrivateMessages(this.current_user.mobile_number, userId).subscribe((msgs: any) => {
      this.currentMessages$.next(msgs);
    });
  }

  fillGroupMessages = (groupId: String) => {
    this.getGroupMessages(groupId).subscribe((msgs: any) => {
      this.currentMessages$.next(msgs);
    });
  }

  fillChatList = () => {
    this.getUserChatList(this.current_user.mobile_number)
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

  getGroupMessages = (groupId: String) => {
    return this.httpClient.get(environment.baseApiUrl + '/message/group-messsages/' + groupId);
  }
}
