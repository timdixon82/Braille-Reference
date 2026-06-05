// @ts-check
// Playwright end-to-end tests for the UEB Braille Reference page.
// All 71 scenarios from Carol's test-scenarios.md are covered here.
//
// The page has a 200 ms debounce on search inputs. Scenarios that type into a
// search field wait 300 ms afterwards to allow the debounce to fire before
// making assertions.
//
// Selectors used throughout match the IDs and attributes in index.html.

import { test, expect } from '@playwright/test';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

// Count the number of visible rows in #rows. A row is visible when its
// computed display style is not 'none'.
async function visibleRowCount(page) {
  return page.evaluate(() => {
    const rows = document.querySelectorAll('#rows tr');
    let count = 0;
    for (const row of rows) {
      if (window.getComputedStyle(row).display !== 'none') count++;
    }
    return count;
  });
}

// Return the text of a visible row's category tag, for all visible rows.
async function visibleCategoryTags(page) {
  return page.evaluate(() => {
    const rows = document.querySelectorAll('#rows tr');
    const tags = [];
    for (const row of rows) {
      if (window.getComputedStyle(row).display !== 'none') {
        const tag = row.querySelector('.category-tag');
        if (tag) tags.push(tag.textContent.trim());
      }
    }
    return tags;
  });
}

// Return the print-cell text for all visible rows.
async function visiblePrintCells(page) {
  return page.evaluate(() => {
    const rows = document.querySelectorAll('#rows tr');
    const prints = [];
    for (const row of rows) {
      if (window.getComputedStyle(row).display !== 'none') {
        const td = row.querySelector('.print-cell');
        if (td) prints.push(td.textContent.trim());
      }
    }
    return prints;
  });
}

// Grade-2-only category values as they appear in the data.
const GRADE2_ONLY_CATEGORIES = [
  'Wordsign',
  'Strong wordsign',
  'Strong groupsign',
  'Lower contraction',
  'Initial-letter',
  'Final-letter',
  'Shortform',
];

// ---------------------------------------------------------------------------
// 1. Page load
// ---------------------------------------------------------------------------

test.describe('1. Page load', () => {
  test('Page title is correct', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle('UEB Braille Reference — Interactive Table');
  });

  test('H1 is present and correct', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('UEB Braille Reference');
  });

  test('Table body has rows after load', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    const count = await visibleRowCount(page);
    expect(count).toBeGreaterThan(0);
  });

  test('Status element does not show "Loading" after load', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    const text = await page.locator('#status').textContent();
    expect(text).not.toBe('Loading…');
    expect(text).toMatch(/\d+ entr(y|ies) shown/);
  });

  test('Status element shows a numeric count after load', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    const text = await page.locator('#status').textContent();
    const match = text.match(/^(\d+)/);
    expect(match).not.toBeNull();
    expect(parseInt(match[1], 10)).toBeGreaterThan(0);
  });

  test('Empty-state element is hidden on load', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    await expect(page.locator('#empty-state')).toBeHidden();
  });
});

// ---------------------------------------------------------------------------
// 2. Grade filter
// ---------------------------------------------------------------------------

test.describe('2. Grade filter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
  });

  test('Grade 1 is the default selection', async ({ page }) => {
    await expect(page.locator('input[name="grade"][value="1"]')).toBeChecked();
  });

  test('Grade 2-only category labels are hidden when Grade 1 is selected', async ({ page }) => {
    const grade2Labels = page.locator('.grade2-only');
    const count = await grade2Labels.count();
    for (let i = 0; i < count; i++) {
      await expect(grade2Labels.nth(i)).toBeHidden();
    }
  });

  test('Grade 2-only rows are absent when Grade 1 is selected', async ({ page }) => {
    const tags = await visibleCategoryTags(page);
    for (const cat of GRADE2_ONLY_CATEGORIES) {
      expect(tags).not.toContain(cat);
    }
  });

  test('Switching to Grade 2 reveals Grade 2-only category labels', async ({ page }) => {
    await page.locator('input[name="grade"][value="2"]').click();
    const grade2Labels = page.locator('.grade2-only');
    const count = await grade2Labels.count();
    for (let i = 0; i < count; i++) {
      await expect(grade2Labels.nth(i)).toBeVisible();
    }
  });

  test('Switching to Grade 2 increases the visible row count', async ({ page }) => {
    const grade1Count = await visibleRowCount(page);
    await page.locator('input[name="grade"][value="2"]').click();
    const grade2Count = await visibleRowCount(page);
    expect(grade2Count).toBeGreaterThan(grade1Count);
  });

  test('Switching to Grade 2 shows "but" (alphabetic wordsign)', async ({ page }) => {
    await page.locator('input[name="grade"][value="2"]').click();
    const prints = await visiblePrintCells(page);
    expect(prints).toContain('but');
  });

  test('Switching back to Grade 1 hides Grade 2-only rows again', async ({ page }) => {
    await page.locator('input[name="grade"][value="2"]').click();
    await page.locator('input[name="grade"][value="1"]').click();
    const tags = await visibleCategoryTags(page);
    for (const cat of GRADE2_ONLY_CATEGORIES) {
      expect(tags).not.toContain(cat);
    }
  });

  test('Status text updates to reflect the active grade', async ({ page }) => {
    await page.locator('input[name="grade"][value="2"]').click();
    const text = await page.locator('#status').textContent();
    expect(text).toContain('Grade 2');
  });
});

// ---------------------------------------------------------------------------
// 3. Text search
// ---------------------------------------------------------------------------

test.describe('3. Text search', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
  });

  test('Typing "the" in Grade 2 filters the table to matching rows', async ({ page }) => {
    await page.locator('input[name="grade"][value="2"]').click();
    await page.locator('#text-search').fill('the');
    await page.waitForTimeout(300);
    const filteredCount = await visibleRowCount(page);
    expect(filteredCount).toBeGreaterThan(0);

    // Every visible row must contain "the" (case-insensitive) in print or notes
    const allMatch = await page.evaluate(() => {
      const rows = document.querySelectorAll('#rows tr');
      for (const row of rows) {
        if (window.getComputedStyle(row).display === 'none') continue;
        const printCell = row.querySelector('.print-cell')?.textContent?.toLowerCase() ?? '';
        const notesCell = row.querySelectorAll('td')[4]?.textContent?.toLowerCase() ?? '';
        if (!printCell.includes('the') && !notesCell.includes('the')) return false;
      }
      return true;
    });
    expect(allMatch).toBe(true);
  });

  test('Search by notes text: typing "louis braille" returns the "w" row', async ({ page }) => {
    await page.locator('input[name="grade"][value="1"]').click();
    await page.locator('#text-search').fill('louis braille');
    await page.waitForTimeout(300);
    const prints = await visiblePrintCells(page);
    expect(prints).toContain('w');
  });

  test('Status element updates to show filtered count and search term', async ({ page }) => {
    await page.locator('input[name="grade"][value="2"]').click();
    await page.locator('#text-search').fill('the');
    await page.waitForTimeout(300);
    const text = await page.locator('#status').textContent();
    expect(text).toContain('"the"');
    expect(text).toMatch(/\d+/);
  });

  test('Clearing text search restores the full filtered set', async ({ page }) => {
    const initial = await visibleRowCount(page);
    await page.locator('#text-search').fill('the');
    await page.waitForTimeout(300);
    // Delete all text by filling with empty string
    await page.locator('#text-search').fill('');
    await page.waitForTimeout(300);
    const restored = await visibleRowCount(page);
    expect(restored).toBe(initial);
  });

  test('Search is case-insensitive', async ({ page }) => {
    await page.locator('input[name="grade"][value="2"]').click();
    await page.locator('#text-search').fill('the');
    await page.waitForTimeout(300);
    const lowerCount = await visibleRowCount(page);

    await page.locator('#text-search').fill('');
    await page.waitForTimeout(300);

    await page.locator('#text-search').fill('THE');
    await page.waitForTimeout(300);
    const upperCount = await visibleRowCount(page);

    expect(upperCount).toBe(lowerCount);
  });

  test('Typing a term with no matches triggers no-results state', async ({ page }) => {
    await page.locator('#text-search').fill('zzzznotamatch');
    await page.waitForTimeout(300);
    const count = await visibleRowCount(page);
    expect(count).toBe(0);
    await expect(page.locator('#empty-state')).toBeVisible();
    const statusText = await page.locator('#status').textContent();
    expect(statusText).toContain('No entries match');
  });
});

// ---------------------------------------------------------------------------
// 4. Dot search
// ---------------------------------------------------------------------------

test.describe('4. Dot search', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
  });

  test('Entering "1 2 3" shows rows with cells matching dots 1, 2, 3', async ({ page }) => {
    await page.locator('#dot-search').fill('1 2 3');
    await page.waitForTimeout(300);
    const prints = await visiblePrintCells(page);
    // With Grade 1, the letter l (dots 1,2,3) must be present
    expect(prints).toContain('l');
    // All visible rows must reference dots 1, 2, 3 in their dot-pattern column
    const allMatch = await page.evaluate(() => {
      const rows = document.querySelectorAll('#rows tr');
      for (const row of rows) {
        if (window.getComputedStyle(row).display === 'none') continue;
        const dotsTd = row.querySelectorAll('td')[2];
        if (!dotsTd) return false;
        const text = dotsTd.textContent.toLowerCase();
        // The cell text contains "dots 1, 2, 3" or "cell N: dots 1, 2, 3"
        if (!text.includes('1, 2, 3') && !text.includes('1,2,3')) return false;
      }
      return true;
    });
    expect(allMatch).toBe(true);
  });

  test('Entering dash-separated "1-2-3" is treated the same as "1 2 3"', async ({ page }) => {
    await page.locator('#dot-search').fill('1 2 3');
    await page.waitForTimeout(300);
    const spaceCount = await visibleRowCount(page);

    await page.locator('#dot-search').fill('1-2-3');
    await page.waitForTimeout(300);
    const dashCount = await visibleRowCount(page);

    expect(dashCount).toBe(spaceCount);
  });

  test('Multi-cell search "5 / 1 4 5" shows the "day" contraction', async ({ page }) => {
    await page.locator('input[name="grade"][value="2"]').click();
    await page.locator('#dot-search').fill('5 / 1 4 5');
    await page.waitForTimeout(300);
    const prints = await visiblePrintCells(page);
    expect(prints).toContain('day');
  });

  test('Dot search status text names the pattern', async ({ page }) => {
    await page.locator('#dot-search').fill('1 2 3');
    await page.waitForTimeout(300);
    const text = await page.locator('#status').textContent();
    expect(text.toLowerCase()).toMatch(/dot/);
  });

  test('Clearing dot search restores results', async ({ page }) => {
    const initial = await visibleRowCount(page);
    await page.locator('#dot-search').fill('1 2 3');
    await page.waitForTimeout(300);
    await page.locator('#dot-search').fill('');
    await page.waitForTimeout(300);
    const restored = await visibleRowCount(page);
    expect(restored).toBe(initial);
  });

  test('An invalid dot entry (non-digit characters only e.g. "abc") shows all rows', async ({ page }) => {
    const initial = await visibleRowCount(page);
    await page.locator('#dot-search').fill('abc');
    await page.waitForTimeout(300);
    const after = await visibleRowCount(page);
    expect(after).toBe(initial);
  });
});

// ---------------------------------------------------------------------------
// 5. Category checkboxes
// ---------------------------------------------------------------------------

test.describe('5. Category checkboxes', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
  });

  test('All Grade 1 categories are checked by default', async ({ page }) => {
    for (const val of ['alphabet', 'number', 'punctuation', 'indicator']) {
      await expect(page.locator(`input[name="cat"][value="${val}"]`)).toBeChecked();
    }
  });

  test('Unchecking "Alphabet" removes alphabet rows from the table', async ({ page }) => {
    await page.locator('input[name="cat"][value="alphabet"]').uncheck();
    const tags = await visibleCategoryTags(page);
    expect(tags).not.toContain('Alphabet');
  });

  test('Re-checking "Alphabet" restores alphabet rows', async ({ page }) => {
    await page.locator('input[name="cat"][value="alphabet"]').uncheck();
    await page.locator('input[name="cat"][value="alphabet"]').check();
    const tags = await visibleCategoryTags(page);
    expect(tags).toContain('Alphabet');
  });

  test('Unchecking multiple categories removes all their rows', async ({ page }) => {
    await page.locator('input[name="cat"][value="alphabet"]').uncheck();
    await page.locator('input[name="cat"][value="number"]').uncheck();
    const tags = await visibleCategoryTags(page);
    expect(tags).not.toContain('Alphabet');
    expect(tags).not.toContain('Number');
  });

  test('Status count decreases when a category is unchecked', async ({ page }) => {
    const statusBefore = await page.locator('#status').textContent();
    const beforeMatch = statusBefore.match(/^(\d+)/);
    const beforeCount = parseInt(beforeMatch[1], 10);

    await page.locator('input[name="cat"][value="alphabet"]').uncheck();

    const statusAfter = await page.locator('#status').textContent();
    const afterMatch = statusAfter.match(/^(\d+)/);
    const afterCount = parseInt(afterMatch[1], 10);

    expect(afterCount).toBeLessThan(beforeCount);
  });

  test('Grade 2-only checkboxes are checked when Grade 2 is selected', async ({ page }) => {
    await page.locator('input[name="grade"][value="2"]').click();
    for (const val of ['wordsign', 'strong-wordsign', 'strong-groupsign', 'lower', 'initial-letter', 'final-letter', 'shortform']) {
      await expect(page.locator(`input[name="cat"][value="${val}"]`)).toBeChecked();
    }
  });

  test('Unchecking a Grade 2-only category removes those rows', async ({ page }) => {
    await page.locator('input[name="grade"][value="2"]').click();
    await page.locator('input[name="cat"][value="wordsign"]').uncheck();
    const tags = await visibleCategoryTags(page);
    expect(tags).not.toContain('Wordsign');
  });
});

// ---------------------------------------------------------------------------
// 6. Combined filters
// ---------------------------------------------------------------------------

test.describe('6. Combined filters', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
  });

  test('Text search + Grade 1 filter combine correctly', async ({ page }) => {
    await expect(page.locator('input[name="grade"][value="1"]')).toBeChecked();
    await page.locator('#text-search').fill('letter');
    await page.waitForTimeout(300);

    // Every visible row must contain "letter" in notes (case-insensitive)
    // and must not be a Grade 2-only category
    const allMatch = await page.evaluate((g2cats) => {
      const rows = document.querySelectorAll('#rows tr');
      for (const row of rows) {
        if (window.getComputedStyle(row).display === 'none') continue;
        const notesCell = row.querySelectorAll('td')[4]?.textContent?.toLowerCase() ?? '';
        const printCell = row.querySelector('.print-cell')?.textContent?.toLowerCase() ?? '';
        if (!notesCell.includes('letter') && !printCell.includes('letter')) return false;
        const tag = row.querySelector('.category-tag')?.textContent?.trim() ?? '';
        if (g2cats.includes(tag)) return false;
      }
      return true;
    }, GRADE2_ONLY_CATEGORIES);

    expect(allMatch).toBe(true);
  });

  test('Text search + Grade 2 filter shows results >= Grade 1 count', async ({ page }) => {
    await page.locator('#text-search').fill('letter');
    await page.waitForTimeout(300);
    const grade1Count = await visibleRowCount(page);

    await page.locator('input[name="grade"][value="2"]').click();
    await page.waitForTimeout(100);
    const grade2Count = await visibleRowCount(page);

    expect(grade2Count).toBeGreaterThanOrEqual(grade1Count);
  });

  test('Dot search + category unchecked: unchecked category rows are excluded', async ({ page }) => {
    await page.locator('#dot-search').fill('1 2 3');
    await page.waitForTimeout(300);
    await page.locator('input[name="cat"][value="alphabet"]').uncheck();

    const prints = await visiblePrintCells(page);
    expect(prints).not.toContain('l');
  });

  test('Text search + dot search together narrow results further', async ({ page }) => {
    await page.locator('#text-search').fill('letter');
    await page.waitForTimeout(300);
    const textOnlyCount = await visibleRowCount(page);

    await page.locator('#dot-search').fill('1 2 3');
    await page.waitForTimeout(300);
    const combinedCount = await visibleRowCount(page);

    expect(combinedCount).toBeLessThanOrEqual(textOnlyCount);

    // The row for "l" must be visible (Print "l", notes contain "letter", dots 1,2,3)
    const prints = await visiblePrintCells(page);
    expect(prints).toContain('l');
  });

  test('Status text reflects all active filters when both search fields are populated', async ({ page }) => {
    await page.locator('#text-search').fill('letter');
    await page.locator('#dot-search').fill('1 2 3');
    await page.waitForTimeout(300);
    const text = await page.locator('#status').textContent();
    expect(text).toContain('"letter"');
    expect(text.toLowerCase()).toMatch(/dot/);
  });
});

// ---------------------------------------------------------------------------
// 7. No-results state
// ---------------------------------------------------------------------------

test.describe('7. No-results state', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
  });

  test('Text search with no matches shows the empty-state element', async ({ page }) => {
    await page.locator('#text-search').fill('zzzznotamatch');
    await page.waitForTimeout(300);
    await expect(page.locator('#empty-state')).toBeVisible();
  });

  test('Text search with no matches shows "No entries match" in the status element', async ({ page }) => {
    await page.locator('#text-search').fill('zzzznotamatch');
    await page.waitForTimeout(300);
    const text = await page.locator('#status').textContent();
    expect(text).toMatch(/^No entries match/);
  });

  test('No visible rows exist when no results match', async ({ page }) => {
    await page.locator('#text-search').fill('zzzznotamatch');
    await page.waitForTimeout(300);
    const count = await visibleRowCount(page);
    expect(count).toBe(0);
  });

  test('Clearing the search from a no-results state removes the empty-state element', async ({ page }) => {
    await page.locator('#text-search').fill('zzzznotamatch');
    await page.waitForTimeout(300);
    await page.locator('#clear-text').click();
    await expect(page.locator('#empty-state')).toBeHidden();
    const count = await visibleRowCount(page);
    expect(count).toBeGreaterThan(0);
  });

  test('All categories unchecked produces no-results state', async ({ page }) => {
    // Uncheck every visible category checkbox
    const checkboxes = page.locator('input[name="cat"]');
    const count = await checkboxes.count();
    for (let i = 0; i < count; i++) {
      const checkbox = checkboxes.nth(i);
      if (await checkbox.isVisible()) {
        await checkbox.uncheck();
      }
    }
    await expect(page.locator('#empty-state')).toBeVisible();
    const statusText = await page.locator('#status').textContent();
    expect(statusText).toMatch(/^No entries match/);
  });
});

// ---------------------------------------------------------------------------
// 8. Clear button behaviour
// ---------------------------------------------------------------------------

test.describe('8. Clear button behaviour', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
  });

  test('Clear text button is labelled "Clear"', async ({ page }) => {
    await expect(page.locator('#clear-text')).toHaveText('Clear');
  });

  test('Clear dots button is labelled "Clear"', async ({ page }) => {
    await expect(page.locator('#clear-dots')).toHaveText('Clear');
  });

  test('Clicking Clear text empties the text search field', async ({ page }) => {
    await page.locator('#text-search').fill('the');
    await page.waitForTimeout(300);
    await page.locator('#clear-text').click();
    await expect(page.locator('#text-search')).toHaveValue('');
  });

  test('Clicking Clear text updates the results table', async ({ page }) => {
    const initial = await visibleRowCount(page);
    await page.locator('#text-search').fill('the');
    await page.waitForTimeout(300);
    await page.locator('#clear-text').click();
    const after = await visibleRowCount(page);
    expect(after).toBe(initial);
  });

  test('Clicking Clear text moves focus back to the text search input', async ({ page }) => {
    await page.locator('#text-search').fill('the');
    await page.locator('#clear-text').click();
    await expect(page.locator('#text-search')).toBeFocused();
  });

  test('Clicking Clear dots empties the dot search field', async ({ page }) => {
    await page.locator('#dot-search').fill('1 2 3');
    await page.waitForTimeout(300);
    await page.locator('#clear-dots').click();
    await expect(page.locator('#dot-search')).toHaveValue('');
  });

  test('Clicking Clear dots updates the results table', async ({ page }) => {
    const initial = await visibleRowCount(page);
    await page.locator('#dot-search').fill('1 2 3');
    await page.waitForTimeout(300);
    await page.locator('#clear-dots').click();
    const after = await visibleRowCount(page);
    expect(after).toBe(initial);
  });

  test('Clicking Clear dots moves focus back to the dot search input', async ({ page }) => {
    await page.locator('#dot-search').fill('1 2 3');
    await page.locator('#clear-dots').click();
    await expect(page.locator('#dot-search')).toBeFocused();
  });

  test('Clear text button does not affect the dot search field', async ({ page }) => {
    await page.locator('#text-search').fill('the');
    await page.locator('#dot-search').fill('1 2');
    await page.waitForTimeout(300);
    await page.locator('#clear-text').click();
    await expect(page.locator('#dot-search')).toHaveValue('1 2');
  });

  test('Clear dots button does not affect the text search field', async ({ page }) => {
    await page.locator('#text-search').fill('the');
    await page.locator('#dot-search').fill('1 2');
    await page.waitForTimeout(300);
    await page.locator('#clear-dots').click();
    await expect(page.locator('#text-search')).toHaveValue('the');
  });
});

// ---------------------------------------------------------------------------
// 9. Braille cell reference (details/summary)
// ---------------------------------------------------------------------------

test.describe('9. Braille cell reference (details/summary)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
  });

  test('Details element is present and collapsed by default', async ({ page }) => {
    const details = page.locator('details');
    await expect(details).toBeAttached();
    // The element must not have the open attribute on load
    const isOpen = await details.evaluate(el => el.hasAttribute('open'));
    expect(isOpen).toBe(false);
  });

  test('Clicking the summary opens the details element', async ({ page }) => {
    await page.locator('details summary').click();
    const details = page.locator('details');
    const isOpen = await details.evaluate(el => el.hasAttribute('open'));
    expect(isOpen).toBe(true);
  });

  test('The expanded content describes the dot numbering', async ({ page }) => {
    await page.locator('details summary').click();
    const detailsText = await page.locator('details').textContent();
    expect(detailsText).toContain('Dot 1');
    expect(detailsText).toContain('Dot 6');
  });

  test('Clicking the summary again closes the details element', async ({ page }) => {
    const summary = page.locator('details summary');
    await summary.click(); // open
    await summary.click(); // close
    const isOpen = await page.locator('details').evaluate(el => el.hasAttribute('open'));
    expect(isOpen).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// 10. Glossary section
// ---------------------------------------------------------------------------

test.describe('10. Glossary section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
  });

  test('Terms used section is present', async ({ page }) => {
    await expect(page.locator('#terms-used')).toBeAttached();
  });

  test('Terms used section has a visible heading', async ({ page }) => {
    const heading = page.locator('#terms-used-heading');
    await expect(heading).toBeVisible();
    await expect(heading).toContainText('Terms used');
  });

  test('The glossary contains a definition list', async ({ page }) => {
    await expect(page.locator('#terms-used dl')).toBeAttached();
  });

  test('The glossary contains at least one defined term', async ({ page }) => {
    const count = await page.locator('#terms-used dl dt').count();
    expect(count).toBeGreaterThan(0);
  });

  test('"Wordsign" is defined', async ({ page }) => {
    // Find the dt containing "Wordsign"
    const dt = page.locator('#terms-used dl dt').filter({ hasText: 'Wordsign' }).first();
    await expect(dt).toBeAttached();
    // The following dd must have non-empty text
    const ddText = await dt.evaluate(el => {
      const dd = el.nextElementSibling;
      return dd ? dd.textContent.trim() : '';
    });
    expect(ddText.length).toBeGreaterThan(0);
  });

  test('"Contraction" is defined', async ({ page }) => {
    const dt = page.locator('#terms-used dl dt').filter({ hasText: 'Contraction' }).first();
    await expect(dt).toBeAttached();
    const ddText = await dt.evaluate(el => {
      const dd = el.nextElementSibling;
      return dd ? dd.textContent.trim() : '';
    });
    expect(ddText.length).toBeGreaterThan(0);
  });

  test('"Shortform" is defined', async ({ page }) => {
    const dt = page.locator('#terms-used dl dt').filter({ hasText: 'Shortform' }).first();
    await expect(dt).toBeAttached();
    const ddText = await dt.evaluate(el => {
      const dd = el.nextElementSibling;
      return dd ? dd.textContent.trim() : '';
    });
    expect(ddText.length).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// 11. Keyboard operability
// ---------------------------------------------------------------------------

test.describe('11. Keyboard operability', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
  });

  test('Skip link is the first focusable element', async ({ page }) => {
    await page.keyboard.press('Tab');
    const focusedClass = await page.evaluate(() => {
      const el = document.activeElement;
      return el ? el.className : '';
    });
    expect(focusedClass).toContain('skip-link');
  });

  test('Skip link target exists', async ({ page }) => {
    await expect(page.locator('#main')).toBeAttached();
  });

  test('Tab reaches the Grade 1 radio button', async ({ page }) => {
    // Tab through enough elements to reach the Grade 1 radio
    let found = false;
    for (let i = 0; i < 20; i++) {
      await page.keyboard.press('Tab');
      const val = await page.evaluate(() => {
        const el = document.activeElement;
        return el instanceof HTMLInputElement ? el.value : null;
      });
      if (val === '1') { found = true; break; }
    }
    expect(found).toBe(true);
  });

  test('Grade 2 radio button is reachable via arrow key from Grade 1', async ({ page }) => {
    // Radio groups follow the "roving tabindex" pattern: only the checked radio
    // in a group is in the tab sequence. Within the group, arrow keys move focus.
    // Confirm that pressing ArrowDown from the Grade 1 radio focuses the Grade 2 radio.
    await page.locator('input[name="grade"][value="1"]').focus();
    await page.keyboard.press('ArrowDown');
    const val = await page.evaluate(() => {
      const el = document.activeElement;
      return el instanceof HTMLInputElement ? el.value : null;
    });
    expect(val).toBe('2');
  });

  test('Arrow keys move between grade radio buttons', async ({ page }) => {
    // Focus the Grade 1 radio first
    await page.locator('input[name="grade"][value="1"]').focus();
    await page.keyboard.press('ArrowDown');
    const checked = await page.evaluate(() => {
      const el = document.activeElement;
      return el instanceof HTMLInputElement ? el.value : null;
    });
    expect(checked).toBe('2');
    await expect(page.locator('input[name="grade"][value="2"]')).toBeChecked();
  });

  test('Tab reaches the Alphabet category checkbox', async ({ page }) => {
    let found = false;
    for (let i = 0; i < 30; i++) {
      await page.keyboard.press('Tab');
      const val = await page.evaluate(() => {
        const el = document.activeElement;
        return el instanceof HTMLInputElement ? el.value : null;
      });
      if (val === 'alphabet') { found = true; break; }
    }
    expect(found).toBe(true);
  });

  test('Space toggles a category checkbox', async ({ page }) => {
    await page.locator('input[name="cat"][value="alphabet"]').focus();
    await page.keyboard.press('Space');
    await expect(page.locator('input[name="cat"][value="alphabet"]')).not.toBeChecked();
    await page.keyboard.press('Space');
    await expect(page.locator('input[name="cat"][value="alphabet"]')).toBeChecked();
  });

  test('Tab reaches the text search input', async ({ page }) => {
    let found = false;
    for (let i = 0; i < 40; i++) {
      await page.keyboard.press('Tab');
      const id = await page.evaluate(() => {
        const el = document.activeElement;
        return el ? el.id : null;
      });
      if (id === 'text-search') { found = true; break; }
    }
    expect(found).toBe(true);
  });

  test('Tab reaches the Clear text button', async ({ page }) => {
    let found = false;
    for (let i = 0; i < 50; i++) {
      await page.keyboard.press('Tab');
      const id = await page.evaluate(() => {
        const el = document.activeElement;
        return el ? el.id : null;
      });
      if (id === 'clear-text') { found = true; break; }
    }
    expect(found).toBe(true);
  });

  test('Enter activates the Clear text button when focused', async ({ page }) => {
    await page.locator('#text-search').fill('the');
    await page.waitForTimeout(300);
    await page.locator('#clear-text').focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('#text-search')).toHaveValue('');
  });

  test('Tab reaches the dot search input', async ({ page }) => {
    let found = false;
    for (let i = 0; i < 50; i++) {
      await page.keyboard.press('Tab');
      const id = await page.evaluate(() => {
        const el = document.activeElement;
        return el ? el.id : null;
      });
      if (id === 'dot-search') { found = true; break; }
    }
    expect(found).toBe(true);
  });

  test('Tab reaches the Clear dots button', async ({ page }) => {
    let found = false;
    for (let i = 0; i < 60; i++) {
      await page.keyboard.press('Tab');
      const id = await page.evaluate(() => {
        const el = document.activeElement;
        return el ? el.id : null;
      });
      if (id === 'clear-dots') { found = true; break; }
    }
    expect(found).toBe(true);
  });

  test('Tab reaches the details summary', async ({ page }) => {
    let found = false;
    for (let i = 0; i < 20; i++) {
      await page.keyboard.press('Tab');
      const tag = await page.evaluate(() => {
        const el = document.activeElement;
        return el ? el.tagName.toLowerCase() : null;
      });
      if (tag === 'summary') { found = true; break; }
    }
    expect(found).toBe(true);
  });

  test('Enter opens the details element when summary is focused', async ({ page }) => {
    await page.locator('details summary').focus();
    await page.keyboard.press('Enter');
    const isOpen = await page.locator('details').evaluate(el => el.hasAttribute('open'));
    expect(isOpen).toBe(true);
  });

  test('No element traps keyboard focus', async ({ page }) => {
    // Walk through all interactive elements by pressing Tab. Collect visited IDs/tags.
    // The test passes if focus cycles back (or returns to browser chrome) without
    // getting stuck on any element. We allow up to 100 tabs and expect to have seen
    // at least the key interactive elements.
    const visited = new Set();
    const keyElements = ['skip-link', 'text-search', 'clear-text', 'dot-search', 'clear-dots'];
    let foundAll = false;

    for (let i = 0; i < 100; i++) {
      await page.keyboard.press('Tab');
      const info = await page.evaluate(() => {
        const el = document.activeElement;
        return el ? { id: el.id, tag: el.tagName.toLowerCase(), cls: el.className } : null;
      });
      if (!info) break;
      const key = info.id || `${info.tag}:${info.cls}`;
      if (visited.has(key) && i > 10) {
        // Focus has cycled — no trap
        break;
      }
      visited.add(key);
      if (keyElements.every(k => [...visited].some(v => v.includes(k)))) {
        foundAll = true;
        break;
      }
    }

    expect(foundAll).toBe(true);
  });
});
