import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPhone, faLifeRing } from '@fortawesome/free-solid-svg-icons';
import { ChatCreateComponent } from './chat-create/chat-create.component';
import { ChatFriendsComponent } from './chat-friends/chat-friends.component';
import { ChatListComponent } from './chat-list/chat-list.component';
import { ChatNotificationsComponent } from './chat-notifications/chat-notifications.component';
import { ChatSettingsComponent } from './chat-settings/chat-settings.component';

@Component({
  selector: 'app-chat-nav',
  templateUrl: './chat-nav.component.html',
  styleUrls: ['./chat-nav.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule,
    ChatCreateComponent,
    ChatFriendsComponent,
    ChatNotificationsComponent,
    ChatSettingsComponent,
    ChatListComponent
  ]
})
export class ChatNavComponent {
  faPhone = faPhone;
  faLifeRing = faLifeRing;
  constructor() {
  }
}
