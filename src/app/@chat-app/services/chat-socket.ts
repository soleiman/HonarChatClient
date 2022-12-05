import { Injectable } from "@angular/core";
import { Socket } from "ngx-socket-io";
import { environment } from "../../../environment/environment";

@Injectable()
export class ChatSocket extends Socket {
  constructor() {
    const user = window.sessionStorage.getItem("auth-user");
    let socketUrl = environment.socketUrl.toString()
    let data = null;
    if (user) data = JSON.parse(user);
    
    let token = '';
    if(data) {
      token = data.token;
      const userVar = `user_id=${data.mobile_number}`;

      socketUrl += `?${userVar}`;
    }
    super({ 
      url: socketUrl,
      options: {
        auth: {
          token: token
        },
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 5000,
        reconnectionDelayMax: 30000
      } 
    });
  }
}
