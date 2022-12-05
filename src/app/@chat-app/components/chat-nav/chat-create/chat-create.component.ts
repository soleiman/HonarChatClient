import { Component } from '@angular/core';
import { faCheckSquare } from '@fortawesome/free-regular-svg-icons';
import { Contact } from 'src/app/models/contact.model';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { faBan, faEdit, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';
import { Group } from 'src/app/models/group.model';
import { ContactVM } from 'src/app/@chat-app/view-models/contact.view-model';
import { StorageService } from 'src/app/services/storage.service';
import { GroupApiService } from 'src/app/@chat-app/services/group-api.service';
import { ContactApiService } from 'src/app/@chat-app/services/contact-api.service';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat-create',
  templateUrl: './chat-create.component.html',
  styleUrls: ['./chat-create.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FontAwesomeModule
  ]
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
  groupImage = 'assets/img/app/image_icon.svg';

  constructor(private contactApi: ContactApiService, private groupApiService: GroupApiService,
    private toastr: ToastrService, private storage: StorageService) {

      this.storage.getUser().subscribe(user => {
        this.user = user;
      });

      this.contactApi.contactList$.subscribe(contacts => {
        this.fillMembers(contacts);

      });

      this.groupApiService.groupList$.subscribe(groups => {
        this.groups = groups;
      });
  }

  uploadAvatar(e: Event) {
    const target = e.target as HTMLInputElement;
    let fileList = target.files as FileList;
    console.log(`[FILES]`);
    console.log(fileList);

    this.storage.uploadAvatar(fileList, this.user.mobile_number, true).subscribe({
      next: (data:any) => {
        if(data.success) {
          this.groupImage = 'assets/img/avatars/' + data.file_name;
        }
        else {
          console.log("[UPLOAD AVATAR ERROR]: Unsuccessful!!!");
        }
      },
      error: err => { console.log("[UPLOAD AVATAR ERROR]:", err); }
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

    let group = new Group('', this.name, groupMembers, this.groupImage, this.user.mobile_number, this.user.mobile_number, now, this.user.mobile_number);

    this.groupApiService.createGroup(group)
    .subscribe({
        next: (new_group: any) => {
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
    this.groupImage = 'assets/img/app/image_icon.svg';
    this.members.forEach(member => {
      member.selected = false;
    });
  }
}
