import { Component } from '@angular/core';
import { faCheckSquare } from '@fortawesome/free-regular-svg-icons';
import { Contact } from 'src/app/models/contact.model';
import { ContactApiService } from 'src/app/@chat-app/services/contact-api.service';
import { ToastrService } from 'ngx-toastr';
import { StorageService } from 'src/app/services/storage.service';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-contact',
  templateUrl: './create-contact.component.html',
  styleUrls: ['./create-contact.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FontAwesomeModule
  ]
})
export class CreateContactComponent {
  name: string = "";
  mobile_number: string ="";

  faCheck = faCheckSquare;
  contacts: any[] = [];
  user: any;

  constructor(private contactApiService: ContactApiService, private storage: StorageService,
    private toastr: ToastrService) {
    this.contactApiService.contactList$.subscribe(contacts => {
      this.contacts = contacts;
    });

    this.storage.currentUser$.subscribe(user => {
      this.user = user;
    });
  }


  saveContact = () => {
    let now = new Date();
    let contact = new Contact('', this.user.mobile_number, this.mobile_number, this.name, "assets/img/avatars/1.jpg", now.toLocaleString(), now.toLocaleString());
    this.contactApiService.createContact(contact).subscribe(new_contact => {
      this.contacts.push(new_contact);
      this.contactApiService.contactList$.next(this.contacts);
      this.toastr.success('مخاطب با موفقیت اضافه شد');
    },
    err => {
      this.toastr.warning(err.error);
    });
  }
}
