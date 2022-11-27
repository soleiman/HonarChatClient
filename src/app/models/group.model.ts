export class Group {
  id: String;
  name: String;
  members: String;
  image: String;
  admins: String;
  createdBy: String;
  createdAt: Date;

  current_user: String;

  constructor(id: String,
    name: String,
    members: String,
    image: String,
    admins: String,
    createdBy: String,
    createdAt: Date,
    current_user: String) {

    this.id = id;
    this.admins = admins;
    this.name = name;
    this.createdAt = createdAt;
    this.createdBy = createdBy;
    this.image = image;
    this.members = members;

    this.current_user = current_user;
  }

  toJSON() {
    return {
      _id: this.id,
      name: this.name,
      members: this.members,
      image: this.image,
      admins: this.admins,
      createdBy: this.createdBy,
      createdAt: this.createdAt
    }
  }

  createJSON() {
    return { group_name: this.name, members: this.members, user: this.current_user, image: this.image }
  }
}
