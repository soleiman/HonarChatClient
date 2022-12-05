import { Component } from '@angular/core';
import { faMessage, faSquarePlus } from '@fortawesome/free-regular-svg-icons';
import { faUserGroup } from '@fortawesome/free-solid-svg-icons';
import { StorageService } from 'src/app/services/storage.service';
import { faLifeRing } from '@fortawesome/free-solid-svg-icons';
import { ProfileModalComponent } from './profile-modal/profile-modal.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule,
    ProfileModalComponent
  ]
})
export class MainNavComponent {
  user: any;

  constructor(private storage: StorageService) {
    this.storage.getUser().subscribe(user =>this.user = user);
  } 
  faLifeRing = faLifeRing;
  faMessage = faMessage;
  faUserGroup = faUserGroup;
  faSquarePlus = faSquarePlus;
}
