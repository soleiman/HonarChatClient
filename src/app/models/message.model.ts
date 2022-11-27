export class Message {
  _id: string;
  body: String;
  date: Date;
  sender: String;
  status: Number;
  recvId: String;
  recvIsGroup: Boolean;

  constructor(_id: string,
  body: String,
  date: Date,
  sender: String,
  status: Number,
  recvId: String,
  recvIsGroup: Boolean) {
    this._id = _id;
    this.body = body;
    this.date = date;
    this.sender = sender;
    this.status = status;
    this.recvId = recvId;
    this.recvIsGroup = recvIsGroup;
  }
}
