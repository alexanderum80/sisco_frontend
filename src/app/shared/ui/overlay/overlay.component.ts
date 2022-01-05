import { Component, OnInit, Input
 } from '@angular/core';

@Component({
  selector: 'app-overlay',
  templateUrl: './overlay.component.html',
  styleUrls: ['./overlay.component.scss']
})
export class OverlayComponent implements OnInit {

  showing = false;
  effect: string;

  @Input() active = false;
  @Input() openEffect = 'zoomIn';
  @Input() closeEffect = 'zoomOut';
  @Input() opacity = 0.8;
  @Input() backgroundColor = '#05050c';

  ngOnInit(): void {
    this.effect = this.openEffect;

    if (this.active) {
        this.show();
    }
  }

  show(): void {
    this.showing = true;
    this.effect = this.openEffect;
  }

  hide(): void {
    this.effect = this.closeEffect;

    setTimeout(() => {
      this.showing = false;
    }, 1000);
  }

  toggle(): void {
    if (this.showing) {
      this.hide();
    } else {
      this.show();
    }
  }

}
