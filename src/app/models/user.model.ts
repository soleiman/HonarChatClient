export class User {
  id: string;
  mobileNumber: string;
  fullName: string;
  profileImg: string;
  lastSeen: Date;

  constructor(id: string, mobileNumber: string, fullName: string, profileImg: string, lastSeen: Date) {
    this.id = id;
    this.fullName = fullName;
    this.mobileNumber = mobileNumber;
    this.profileImg = profileImg;
    this.lastSeen = lastSeen;
  }
}
