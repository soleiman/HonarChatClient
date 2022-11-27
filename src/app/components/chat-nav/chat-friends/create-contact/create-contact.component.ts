import { Component } from '@angular/core';
import { faCheckSquare } from '@fortawesome/free-regular-svg-icons';
import { Contact } from 'src/app/models/contact.model';
import { ContactApiService } from 'src/app/services/contact-api.service';
import { UserApiService } from 'src/app/services/user-api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-contact',
  templateUrl: './create-contact.component.html',
  styleUrls: ['./create-contact.component.scss']
})
export class CreateContactComponent {
  name: string = "";
  mobile_number: string ="";

  faCheck = faCheckSquare;
  contacts: any[] = [];
  user: any;

  constructor(private contactApiService: ContactApiService, private userApiService: UserApiService,
    private toastr: ToastrService) {
    this.contactApiService.contactList$.subscribe(contacts => {
      this.contacts = contacts;
    });

    this.userApiService.getCurrentUserObs().subscribe(user => {
      this.user = user;
    });
  }


  saveContact = () => {
    let now = new Date();
    let contact = new Contact('', this.user.mobileNumber, this.mobile_number, this.name, "assets/img/avatars/1.jpg", now.toLocaleString(), now.toLocaleString());
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
