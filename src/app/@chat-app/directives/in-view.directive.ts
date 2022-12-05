import {Directive, ViewContainerRef, TemplateRef, AfterViewInit} from '@angular/core';
import { SocketApiService } from '../services/socket-api.service';

@Directive({
  selector: '[inView]',
  standalone: true
})
export class InView implements AfterViewInit {
  alreadyRendered: boolean = false; // cheking if visible already
  
  constructor(
    private vcRef: ViewContainerRef,
    private tplRef: TemplateRef<any>,
    private socket: SocketApiService
  ) {}

  ngAfterViewInit() {
    const commentEl = this.vcRef.element.nativeElement; // template
    const elToObserve = commentEl.parentElement;
    this.setMinWidthHeight(elToObserve);
  
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          let st = entry.target.getAttribute('data-status');
          let status: Number = parseInt(st !== null ? st : '0');
          let msgId = entry.target.getAttribute('data-msg-id');
          let isMine: Boolean = entry.target.getAttribute('data-is-mine') === 'true';
          
          this.renderContents(entry.isIntersecting, msgId, status, isMine);
        });
      }, {threshold: [0, .1, .9, 1]});
    observer.observe(elToObserve);
  }

  renderContents(isInView: Boolean, msgId: any, status: Number, isMine: Boolean) {
    // console.log("[InView]: msg -> " + msgId + " | status -> " + status + " | isMine -> " + isMine);
    // console.log("[InView]: alreadyRendered -> " + this.alreadyRendered);
    if (isInView && !this.alreadyRendered) {
      this.vcRef.clear();
      this.vcRef.createEmbeddedView(this.tplRef);
      this.alreadyRendered = true;

      if(!isMine) {
        if(status === 1) {
          console.log("[InView]: msg -> " + msgId + " | status -> " + status + " | isMine -> " + isMine);
          this.socket.getAvtiveRoomId().subscribe({
            next: (data: String) => {
              this.socket.changeMessageStatus({ status: 2, msgId: msgId, roomId: data });
            }
          });
        }
      }
    }
  }

  setMinWidthHeight(el: any) { // prevent issue being visible all together
    const style = window.getComputedStyle(el);
    const [width, height] = [parseInt(style.width), parseInt(style.height)];
    !width && (el.style.minWidth = '40px');
    !height && (el.style.minHeight = '40px');
  }
}