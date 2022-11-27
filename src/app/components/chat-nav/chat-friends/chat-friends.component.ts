import { animate, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { Contact } from 'src/app/models/contact.model';
import { ContactApiService } from 'src/app/services/contact-api.service';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { faBan, faEdit, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-chat-friends',
  templateUrl: './chat-friends.component.html',
  styleUrls: ['./chat-friends.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: '0' }),
        animate('.5s ease-out', style({ opacity: '1' })),
      ]),
    ]),
    trigger('slideIn', [
      transition(':enter', [
        style({transform: 'translateX(-100%)'}),
        animate('200ms ease-in', style({transform: 'translateX(0%)'}))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({transform: 'translateX(-100%)'}))
      ])
    ])
  ]
})
export class ChatFriendsComponent {

  contacts: Contact[] = [];

  faTrash = faTrashCan;
  faBan = faBan;
  faEdit = faEdit;
  faPaperPlane = faPaperPlane;

  constructor(private contactApi: ContactApiService, private toastr: ToastrService) {
    this.contactApi.contactList$.subscribe(contacts => {
      this.contacts = contacts;
      console.log("[CONTACTS]:", this.contacts);
    });
  }

  toDate = (dateStr: string) => {
    let cDate = new Date(dateStr);
    return cDate.toLocaleString('fa');
  }

  deleteContact = (mobile_number: String): void => {

    this.contacts = this.contacts.filter((con) => {
      return con.mobile_number !== mobile_number
    });

    this.contactApi.contactList$.next(this.contacts);

    this.toastr.success('مخاطب با موفقیت حذف شد.');
  }
}
