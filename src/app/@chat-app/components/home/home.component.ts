import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { SocketIoModule } from 'ngx-socket-io';
import { SocketApiService } from 'src/app/@chat-app/services/socket-api.service';
import { StorageService } from '../../../services/storage.service';
import { ChatApiService } from '../../services/chat-api.service';
import { ChatSocket } from '../../services/chat-socket';
import { ContactApiService } from '../../services/contact-api.service';
import { GroupApiService } from '../../services/group-api.service';
import { ChatAreaComponent } from '../chat-area/chat-area.component';
import { ChatNavComponent } from '../chat-nav/chat-nav.component';
import { MainNavComponent } from '../main-nav/main-nav.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    SocketIoModule,
    ChatAreaComponent,
    MainNavComponent,
    ChatNavComponent
  ],
  providers: [
    ChatSocket,
    SocketApiService,
    ChatApiService,
    ContactApiService,
    GroupApiService
  ]
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  title = 'پیام رسان هنر';

  isLoggedIn = false;
  username?: string;
  user: any;

  constructor(private storageService: StorageService,
    private router: Router, private socket: SocketApiService) {
  }

  ngOnDestroy() {
    
  }

  ngAfterViewInit() {
  }

  @HostListener("window:beforeunload", ["$event"]) beforeUnloadHandler(event: Event) {
    console.log("window:beforeunload");
    this.storageService.getUser().subscribe({
      next: user => {
        this.socket.disconnectSocket(user.mobile_number);
      }
    });
  }

  @HostListener("window:unload", ["$event"]) unloadHandler(event: Event) {
    console.log("window:unload");
    this.storageService.getUser().subscribe({
      next: user => {
        this.socket.disconnectSocket(user.mobile_number);
      }
    });
  }

  ngOnInit() {
    this.isLoggedIn = this.storageService.isLoggedIn();

    if (this.isLoggedIn) {
      this.storageService.getUser().subscribe(user => {
        this.username = user.mobile_number;
      });      
    }
    else {
      this.router.navigateByUrl('/login');
    }
  }
  
}
