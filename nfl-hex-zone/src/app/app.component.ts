import { Component, signal } from '@angular/core';
import { HeaderComponent } from './components/header/header.component';
import { CurseFormComponent } from './components/curse-form/curse-form.component';
import { HexBoardComponent } from './components/hex-board/hex-board.component';
import { HexOverlayComponent } from './components/hex-overlay/hex-overlay.component';
import { WitchVerdictFeedComponent } from './components/witch-verdict-feed/witch-verdict-feed.component';

@Component({
  selector: 'app-root',
  imports: [
    HeaderComponent,
    CurseFormComponent,
    HexBoardComponent,
    WitchVerdictFeedComponent,
    HexOverlayComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  protected readonly overlayVisible = signal(false);

  protected onHexCast(): void {
    this.overlayVisible.set(true);
    setTimeout(() => this.overlayVisible.set(false), 1500);
  }
}
