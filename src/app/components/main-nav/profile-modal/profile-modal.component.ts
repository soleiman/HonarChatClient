import { Component, Input } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { faSignOut, faAngleRight } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-profile-modal',
  templateUrl: './profile-modal.component.html',
  styleUrls: ['./profile-modal.component.scss']
})
export class ProfileModalComponent {
  @Input() user: User | undefined;

  faLogOut = faSignOut;
  faArrowRight = faAngleRight;
}
