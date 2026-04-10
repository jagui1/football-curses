import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-hex-overlay',
  imports: [],
  templateUrl: './hex-overlay.component.html',
  styleUrl: './hex-overlay.component.css',
})
export class HexOverlayComponent {
  @Input() visible = false;
}
