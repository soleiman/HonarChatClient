import { Component, Input } from '@angular/core';
import { faSignOut, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { StorageService } from 'src/app/services/storage.service';
import { SocketApiService } from 'src/app/@chat-app/services/socket-api.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile-modal',
  templateUrl: './profile-modal.component.html',
  styleUrls: ['./profile-modal.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule
  ]
})
export class ProfileModalComponent {
  @Input() user: any;

  constructor(private storageService: StorageService, 
    private socket: SocketApiService) {

  }
  faLogOut = faSignOut;
  faArrowRight = faAngleRight;

  uploadAvatar(e: Event) {
    const target = e.target as HTMLInputElement;
    let fileList = target.files as FileList;
    console.log(`[FILES]`);
    console.log(fileList);

    this.storageService.uploadAvatar(fileList, this.user.mobile_number, false).subscribe({
      next: (data:any) => {
        if(data.success) {
          this.user.profile_image = '/assets/img/avatars/' + data.file_name;
        }
        else {
          console.log("[UPLOAD AVATAR ERROR]: Unsuccessful!!!");
        }
      },
      error: err => { console.log("[UPLOAD AVATAR ERROR]:", err); }
    });
  }

  logout = () => {
    this.storageService.getUser().subscribe({
      next: user => {
        console.log('[LOGOUT]:', user);
        this.socket.disconnectSocket(user.mobile_number);
        this.storageService.clean();
        window.location.reload();
      }
    });
  }
}
