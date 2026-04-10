/**
 * Ensures global keyframes for Phase 3.6 remain present in bundled styles.
 */
describe('styles.css verdict pulse keyframes (3.6)', () => {
  it('should define castPulse and rejectedPulse in bundled styles', () => {
    const styleSheets = Array.from(document.styleSheets);
    let foundCast = false;
    let foundRejected = false;
    for (const sheet of styleSheets) {
      let rules: CSSRuleList;
      try {
        rules = sheet.cssRules;
      } catch {
        continue;
      }
      for (let i = 0; i < rules.length; i++) {
        const text = rules[i]!.cssText;
        if (text.includes('castPulse')) foundCast = true;
        if (text.includes('rejectedPulse')) foundRejected = true;
      }
      if (foundCast && foundRejected) break;
    }
    expect(foundCast).toBeTrue();
    expect(foundRejected).toBeTrue();
  });
});
