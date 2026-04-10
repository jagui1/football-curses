import { Injectable, signal } from '@angular/core';
import bcrypt from 'bcryptjs';
import { ADMIN_HASH, WITCH_HASH } from './password-hashes';

@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly witchModeActive = signal(false);
  readonly adminModeActive = signal(false);
  readonly witchLockout = signal(false);
  readonly adminLockout = signal(false);
  readonly witchAttempts = signal(0);
  readonly adminAttempts = signal(0);

  async verifyWitch(password: string): Promise<boolean> {
    if (this.witchLockout()) {
      return false;
    }
    const match = bcrypt.compareSync(password, WITCH_HASH);
    if (match) {
      this.witchModeActive.set(true);
      return true;
    }
    this.witchAttempts.update((n) => n + 1);
    if (this.witchAttempts() >= 3) {
      this.witchLockout.set(true);
    }
    return false;
  }

  async verifyAdmin(password: string): Promise<boolean> {
    if (this.adminLockout()) {
      return false;
    }
    const match = bcrypt.compareSync(password, ADMIN_HASH);
    if (match) {
      this.adminModeActive.set(true);
      return true;
    }
    this.adminAttempts.update((n) => n + 1);
    if (this.adminAttempts() >= 3) {
      this.adminLockout.set(true);
    }
    return false;
  }
}
