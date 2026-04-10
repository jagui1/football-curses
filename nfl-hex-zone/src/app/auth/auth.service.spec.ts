import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should resolve true and set witchModeActive for correct witch password', async () => {
    const auth = TestBed.inject(AuthService);
    const ok = await auth.verifyWitch('ci-test-witch-secret');
    expect(ok).toBeTrue();
    expect(auth.witchModeActive()).toBeTrue();
  });

  it('should resolve false for wrong witch password without activating', async () => {
    const auth = TestBed.inject(AuthService);
    const ok = await auth.verifyWitch('definitely-wrong-password-xyz');
    expect(ok).toBeFalse();
    expect(auth.witchModeActive()).toBeFalse();
  });

  it('should lock out after 3 failed witch attempts and keep witchModeActive false', async () => {
    const auth = TestBed.inject(AuthService);
    await auth.verifyWitch('bad-1');
    await auth.verifyWitch('bad-2');
    await auth.verifyWitch('bad-3');
    expect(auth.witchLockout()).toBeTrue();
    const fourth = await auth.verifyWitch('ci-test-witch-secret');
    expect(fourth).toBeFalse();
    expect(auth.witchModeActive()).toBeFalse();
  });

  it('should keep admin and witch modes independent', async () => {
    const auth = TestBed.inject(AuthService);
    await auth.verifyAdmin('ci-test-admin-secret');
    expect(auth.adminModeActive()).toBeTrue();
    expect(auth.witchModeActive()).toBeFalse();
    await auth.verifyWitch('ci-test-witch-secret');
    expect(auth.witchModeActive()).toBeTrue();
    expect(auth.adminModeActive()).toBeTrue();
  });
});
