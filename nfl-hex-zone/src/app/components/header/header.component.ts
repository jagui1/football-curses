import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  output,
  viewChild,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { AuthService } from '../../auth/auth.service';
import { CurseStoreService } from '../../services/curse-store.service';

const FLOAT_EMOJIS = ['🧙‍♀️', '🏈', '💀', '🪄', '🔮', '☠️', '🏟️'];

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements AfterViewInit {
  protected readonly store = inject(CurseStoreService);
  protected readonly auth = inject(AuthService);
  private readonly document = inject(DOCUMENT);

  /** Fires when the title is triple-clicked within 600ms (Witch modal). */
  readonly triggerWitchModal = output<void>();

  private titleClickTimes: number[] = [];

  private readonly starHost = viewChild.required<ElementRef<HTMLElement>>('starHost');
  private readonly emojiHost = viewChild.required<ElementRef<HTMLElement>>('emojiHost');

  ngAfterViewInit(): void {
    this.spawnStars();
    this.spawnFloatingEmojis();
  }

  protected onTitleClick(): void {
    const now = Date.now();
    this.titleClickTimes.push(now);
    if (this.titleClickTimes.length > 3) {
      this.titleClickTimes.shift();
    }
    if (this.titleClickTimes.length < 3) {
      return;
    }
    const first = this.titleClickTimes[0]!;
    const last = this.titleClickTimes[2]!;
    if (last - first > 600 || this.auth.witchLockout()) {
      return;
    }
    this.triggerWitchModal.emit();
    this.titleClickTimes = [];
  }

  private spawnStars(): void {
    const host = this.starHost().nativeElement;
    const count = 60 + Math.floor(Math.random() * 21);
    for (let i = 0; i < count; i++) {
      const el = this.document.createElement('span');
      el.className = 'header-star';
      el.setAttribute('aria-hidden', 'true');
      el.style.position = 'absolute';
      el.style.top = `${Math.random() * 100}%`;
      el.style.left = `${Math.random() * 100}%`;
      el.style.animationName = 'twinkle';
      el.style.animationTimingFunction = 'ease-in-out';
      el.style.animationIterationCount = 'infinite';
      el.style.animationDirection = 'alternate';
      el.style.animationDelay = `${Math.random() * 5}s`;
      const dur = 2 + Math.random() * 3;
      el.style.animationDuration = `${dur}s`;
      host.appendChild(el);
    }
  }

  private spawnFloatingEmojis(): void {
    const host = this.emojiHost().nativeElement;
    const count = 15 + Math.floor(Math.random() * 6);
    for (let i = 0; i < count; i++) {
      const el = this.document.createElement('span');
      el.className = 'header-float-emoji';
      el.setAttribute('aria-hidden', 'true');
      el.textContent = FLOAT_EMOJIS[Math.floor(Math.random() * FLOAT_EMOJIS.length)]!;
      el.style.position = 'absolute';
      el.style.bottom = '-2rem';
      el.style.left = `${Math.random() * 100}%`;
      el.style.animationName = 'floatEmojiHigh';
      el.style.animationTimingFunction = 'linear';
      el.style.animationIterationCount = 'infinite';
      el.style.animationDelay = `${Math.random() * 8}s`;
      el.style.animationDuration = `${6 + Math.random() * 8}s`;
      el.style.fontSize = `${1 + Math.random() * 1.5}rem`;
      host.appendChild(el);
    }
  }
}
