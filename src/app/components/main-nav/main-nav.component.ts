import { Component } from '@angular/core';
import { faMessage, faSquarePlus } from '@fortawesome/free-regular-svg-icons';
import { faUserGroup } from '@fortawesome/free-solid-svg-icons';
import { UserApiService } from 'src/app/services/user-api.service';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.scss']
})
export class MainNavComponent {
  user: any;

  constructor(private userApiService: UserApiService) {
    this.userApiService.getCurrentUserObs().subscribe(current_user => {
      this.user = current_user;
    });
  }

  faMessage = faMessage;
  faUserGroup = faUserGroup;
  faSquarePlus = faSquarePlus;
}
