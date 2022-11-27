export class ContactVM {
  _id: String;
  user: String;
  mobile_number: String;
  full_name: String;
  contact_image: String;
  last_seen: string;
  create_date: string;

  selected: Boolean = false;


  constructor(_id: String,
    user: String,
    mobile_number: String,
    full_name: String,
    contact_image: String,
    last_seen: string,
    create_date: string) {

      this._id = _id;
      this.contact_image = contact_image;
      this.create_date = create_date;
      this.full_name = full_name;
      this.last_seen = last_seen;
      this.mobile_number = mobile_number;
      this.user = user;

    }

    toJSON(){
      return {
        _id: this._id,
        user: this.user,
        mobile_number: this.mobile_number,
        full_name: this.full_name,
        contact_image: this.contact_image,
        last_seen: this.last_seen,
        create_date: this.create_date,
        selected: this.selected
      }
    }
}
