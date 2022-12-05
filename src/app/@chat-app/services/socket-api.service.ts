import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { StorageService } from 'src/app/services/storage.service';
import { ChatSocket } from './chat-socket';

@Injectable()
export class SocketApiService implements OnInit {

  activeRoomId: String = '';

  activeRoomId$: BehaviorSubject<String> = new BehaviorSubject<String>('');

  constructor(private socket: ChatSocket, private storage: StorageService) {
    this.storage.userSaved$.subscribe({
      next: (data: any) => {
        let isActive = this.socket.ioSocket.active;
        console.log('[constructor]:', isActive);
        this.socket.connect();
      },
      error: err => { console.log(err); }
    });
  }

  ngOnInit(): void {
    
  }

  getAvtiveRoomId = (): Observable<String> => {
    return this.activeRoomId$.asObservable();
  }

  connectSocket = () => {
    console.log(`[connectSocket]`);
    // console.log(this.socket.ioSocket.active);
    return this.socket.connect();
  }

  // emit event
	sendMessage = (data: any) => {
		this.socket.emit('send_message', data);
	}

  changeMessageStatus = (data: any) => {
    console.log('[chage_msg_status]:', data);
    return this.socket.emit('chage_msg_status', data)
  }

  onMsgStatusChanged = () => {
    return this.socket.fromEvent('msg_status_changed');
  }

	// listen event
	onNewMessage = () => {
		return this.socket.fromEvent('new_message');
	}

  onRecieveMsg = () => {
    return this.socket.fromEvent('receive_message');
  }

  joinChat = (roomId: String, mobile_number: String, isGroup: Boolean) => {
    if(this.activeRoomId.length > 0)
      this.leaveChat(this.activeRoomId, mobile_number, isGroup);

    this.socket.emit('join_room', {
      roomId: roomId,
      mobile_number: mobile_number,
      is_group: isGroup
    });
  }

  onUserJoined = () => {
    return this.socket.fromEvent('user_joined');
  }

  onUserLeft = () => {
    return this.socket.fromEvent('user_left');
  }

  leaveChat = (roomId: String, mobile_number: String, isGroup: Boolean) => {
    this.socket.emit('leave_room', {
      room_id: roomId,
      mobile_number: mobile_number,
      is_group: isGroup
    });
  }

  disconnectSocket = (mobile_number: string) => {
    this.socket.emit('disconnect_client', {
      user_id: mobile_number
    });
  }
}
