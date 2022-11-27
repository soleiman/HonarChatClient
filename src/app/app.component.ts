import { Component, OnInit, isDevMode } from '@angular/core';
import { ChatApiService } from './services/chat-api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'HonarChatClient';

  constructor(chatApiService: ChatApiService) {
    chatApiService.getChatListObs().subscribe(s=> {

    });
  }

  ngOnInit() {
    if (isDevMode()) {
      console.log('Development!');
    } else {
      console.log('Production!');
    }
  }
}
