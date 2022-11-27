import { Component } from '@angular/core';
import { faCheckSquare } from '@fortawesome/free-regular-svg-icons';
import { Contact } from 'src/app/models/contact.model';
import { ContactApiService } from 'src/app/services/contact-api.service';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { faBan, faEdit, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';
import { GroupApiService } from 'src/app/services/group-api.service';
import { Group } from 'src/app/models/group.model';
import { UserApiService } from 'src/app/services/user-api.service';
import { ContactVM } from 'src/app/view-models/contact.view-model';

@Component({
  selector: 'app-chat-create',
  templateUrl: './chat-create.component.html',
  styleUrls: ['./chat-create.component.scss']
})
export class ChatCreateComponent {

  faCheckSquare = faCheckSquare;

  //contacts: Contact[] = [];

  faTrash = faTrashCan;
  faBan = faBan;
  faEdit = faEdit;
  faPaperPlane = faPaperPlane;

  name = '';
  desc = '';
  members: any[] = [];

  user: any;

  groups: any[] = [];

  constructor(private contactApi: ContactApiService, private groupApiService: GroupApiService,
    private userApiService: UserApiService, private toastr: ToastrService) {

      this.userApiService.getCurrentUserObs().subscribe(user => {
        this.user = user;
      });

      this.contactApi.contactList$.subscribe(contacts => {
        this.fillMembers(contacts);

      });

      this.groupApiService.groupList$.subscribe(groups => {
        this.groups = groups;
      });
  }

  private fillMembers = (contacts: Contact[]) => {
    this.members = [];
    if(contacts)
      contacts.forEach(contact => {
        let newVm = new ContactVM(contact._id, contact.user, contact.mobile_number, contact.full_name, contact.contact_image, contact.last_seen, contact.create_date);
        this.members.push(newVm.toJSON());
      });
  }

  toDate = (dateStr: string) => {
    let cDate = new Date(dateStr);
    return cDate.toLocaleString('fa');
  }

  createGroup = () => {

    if(this.name.length <= 0){
      this.toastr.warning('وارد کردن نام گروه اجباری است');
      return;
    }

    let now = new Date();

    let groupMembers = '';

    this.members.forEach(member => {
      if(member.selected) {
        groupMembers += member.mobile_number + ',';
      }
    });

    if(groupMembers.length <= 0){
      this.toastr.warning('حداقل یک عضو برای گروه انتخاب کنید');
      return;
    }

    groupMembers = groupMembers.substring(0, groupMembers.length - 1);

    let group = new Group('', this.name, groupMembers, 'assets/img/avatars/bootstrap.svg', this.user.mobileNumber, this.user.mobileNumber, now, this.user.mobileNumber);

    this.groupApiService.createGroup(group)
    .subscribe({
        next: (new_group) => {
          this.groups.push(new_group);
          this.groupApiService.groupList$.next(this.groups);
        },
        error: (err) => this.toastr.warning(err.error),
        complete: () => {
          this.resetForm();
          this.toastr.success('گروه با موفقیت ایجاد شد');
        }
    });
  }

  resetForm = () => {
    this.name = '';
    this.desc = '';
    this.members.forEach(member => {
      member.selected = false;
    });
  }
}
