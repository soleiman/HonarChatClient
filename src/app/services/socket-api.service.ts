import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class SocketApiService {

  activeRoomId: String = '';

  constructor(private socket: Socket) { }

  // emit event
	sendMessage = () => {
		this.socket.emit('send_message');
	}

	// listen event
	onNewMessage = () => {
		return this.socket.fromEvent('new_message');
	}

  joinChat = (roomId: String) => {

    this.leaveChat(this.activeRoomId);

    this.socket.emit('join_room', {
      roomId: roomId
    });
  }

  leaveChat = (roomId: String) => {
    this.socket.emit('leave_room', roomId);
  }
}
