import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MainNavComponent } from './components/main-nav/main-nav.component';
import { ChatNavComponent } from './components/chat-nav/chat-nav.component';
import { ChatAreaComponent } from './components/chat-area/chat-area.component';
import { ChatListComponent } from './components/chat-nav/chat-list/chat-list.component';
import { ChatCreateComponent } from './components/chat-nav/chat-create/chat-create.component';
import { ChatNotificationsComponent } from './components/chat-nav/chat-notifications/chat-notifications.component';
import { ChatFriendsComponent } from './components/chat-nav/chat-friends/chat-friends.component';
import { ChatSettingsComponent } from './components/chat-nav/chat-settings/chat-settings.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CreateContactComponent } from './components/chat-nav/chat-friends/create-contact/create-contact.component';
import { ToastrModule } from 'ngx-toastr';
import { ProfileModalComponent } from './components/main-nav/profile-modal/profile-modal.component';
import { ToUserFullNamePipe } from './pipes/to-user-full-name.pipe';
import { ToUserProfileImagePipe } from './pipes/to-user-profile-image.pipe';
import { ToGroupNamePipe } from './pipes/to-group-name.pipe';
import { ToGroupImagePipe } from './pipes/to-group-image.pipe';
import { ChatAreaGroupComponent } from './components/chat-area/chat-area-group/chat-area-group.component';
import { ChatAreaPrivateComponent } from './components/chat-area/chat-area-private/chat-area-private.component';
import { ChatAreaEmptyComponent } from './components/chat-area/chat-area-empty/chat-area-empty.component';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { environment } from '../environment/environment';

const config: SocketIoConfig = { url: environment.socketUrl, options: {} };

@NgModule({
  declarations: [
    AppComponent,
    MainNavComponent,
    ChatNavComponent,
    ChatAreaComponent,
    ChatListComponent,
    ChatCreateComponent,
    ChatNotificationsComponent,
    ChatFriendsComponent,
    ChatSettingsComponent,
    CreateContactComponent,
    ProfileModalComponent,
    ToUserFullNamePipe,
    ToUserProfileImagePipe,
    ToGroupNamePipe,
    ToGroupImagePipe,
    ChatAreaGroupComponent,
    ChatAreaPrivateComponent,
    ChatAreaEmptyComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    FontAwesomeModule,
    HttpClientModule,
    ToastrModule.forRoot({
      timeOut: 5000,
      positionClass: 'toast-top-center',
      preventDuplicates: true,
    }),
    SocketIoModule.forRoot(config)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
