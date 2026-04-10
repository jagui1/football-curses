import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-skull-sweep-overlay',
  imports: [],
  templateUrl: './skull-sweep-overlay.component.html',
  styleUrl: './skull-sweep-overlay.component.css',
})
export class SkullSweepOverlayComponent {
  @Input({ required: true }) visible = false;
}
