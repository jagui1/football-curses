import { TestBed } from '@angular/core/testing';
import { SEASON_START, SeasonService } from './season.service';

describe('SeasonService', () => {
  let service: SeasonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SeasonService);
    jasmine.clock().install();
    jasmine.clock().mockDate();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should expose SEASON_START', () => {
    expect(SEASON_START).toBe('2025-09-04');
  });

  it('should return week 1 on 2025-09-04', () => {
    jasmine.clock().mockDate(new Date(2025, 8, 4, 12, 0, 0));
    expect(service.getCurrentNflWeek()).toBe(1);
  });

  it('should return week 2 on 2025-09-11', () => {
    jasmine.clock().mockDate(new Date(2025, 8, 11, 12, 0, 0));
    expect(service.getCurrentNflWeek()).toBe(2);
  });

  it('should clamp to 1 before season start', () => {
    jasmine.clock().mockDate(new Date(2025, 7, 1, 12, 0, 0));
    expect(service.getCurrentNflWeek()).toBe(1);
  });

  it('should clamp to 22 far in the future', () => {
    jasmine.clock().mockDate(new Date(2030, 1, 1, 12, 0, 0));
    expect(service.getCurrentNflWeek()).toBe(22);
  });

  it('getWeekLabel should label postseason weeks', () => {
    expect(service.getWeekLabel(19)).toBe('Wild Card Weekend');
    expect(service.getWeekLabel(20)).toBe('Divisional Round');
    expect(service.getWeekLabel(21)).toBe('Championship Weekend');
    expect(service.getWeekLabel(22)).toBe('Super Bowl');
  });

  it('getWeekLabel should return Week N for regular season', () => {
    expect(service.getWeekLabel(5)).toBe('Week 5');
  });

  it('getWeekDateRangeLabel should span 7 days from week start', () => {
    const label = service.getWeekDateRangeLabel(1);
    expect(label).toContain('Sep 4');
    expect(label).toContain('Sep 10');
    expect(label).toContain('–');
  });
});
