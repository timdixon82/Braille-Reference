// Unit tests for the UEB braille data set and conversion helpers.
//
// These tests assert against an INDEPENDENT reference for correct braille,
// not against whatever js/braille-data.js happens to produce:
//
//   1. Unicode braille patterns (U+2800..U+283F). The Unicode standard
//      defines a braille cell's code point as U+2800 plus a bitmask where
//      dot 1 is bit 0, dot 2 is bit 1, ... dot 6 is bit 5. That formula is
//      used directly below to compute the EXPECTED character for a given
//      set of dots, independently of dotsToChar's own implementation.
//   2. The standard Grade 1 (uncontracted) UEB alphabet, digits, and
//      common punctuation, and the standard Grade 2 (contracted) strong
//      wordsigns, strong groupsigns, and alphabetic wordsigns. These are
//      well-established, widely published mappings, cross-checked here
//      against the Unicode reference in (1) above and against generally
//      known UEB reference material.
//
// A small number of entries in js/braille-data.js are NOT independently
// verified here — see the "UNVERIFIED MAPPINGS" block near the bottom of
// this file. Do not add assertions for those without a checked reference.

import { describe, it, expect } from 'vitest';
import {
  data,
  dotsToChar,
  cellsToBraille,
  describeCell,
  cellsToDotsText,
  categoryLabel,
  parseDotInput,
  cellEqual,
  cellsContain,
} from './braille-data.js';

// Independent reference implementation of the Unicode Braille Patterns
// formula (U+2800 + bitmask, dot N => bit N-1). Deliberately written
// separately from dotsToChar so a bug shared between the two would not
// cancel out.
function expectedBrailleChar(dots) {
  let mask = 0;
  for (const d of dots) mask |= 1 << (d - 1);
  return String.fromCodePoint(0x2800 + mask);
}

function findEntry(print, category) {
  const entry = data.find((e) => e.print === print && e.category === category);
  if (!entry) {
    throw new Error(`No data entry found for print="${print}" category="${category}"`);
  }
  return entry;
}

describe('dotsToChar (Unicode Braille Patterns formula)', () => {
  it('renders dot 1 as U+2801', () => {
    expect(dotsToChar([1])).toBe('⠁');
    expect(dotsToChar([1])).toBe(expectedBrailleChar([1]));
  });

  it('renders dots 1,2 as U+2803', () => {
    expect(dotsToChar([1, 2])).toBe('⠃');
  });

  it('renders an empty cell as U+2800 (blank braille pattern)', () => {
    expect(dotsToChar([])).toBe('⠀');
  });

  it('renders all six dots as U+283F (a full cell)', () => {
    expect(dotsToChar([1, 2, 3, 4, 5, 6])).toBe('⠿');
  });

  it('matches the independent Unicode-formula reference for every letter in the data set', () => {
    for (const entry of data) {
      if (entry.category !== 'alphabet') continue;
      const [cell] = entry.cells;
      expect(dotsToChar(cell)).toBe(expectedBrailleChar(cell));
    }
  });

  it('is order-independent: dot order in the input does not change the output', () => {
    expect(dotsToChar([2, 1])).toBe(dotsToChar([1, 2]));
    expect(dotsToChar([6, 3, 1])).toBe(dotsToChar([1, 3, 6]));
  });
});

describe('cellsToBraille (multi-cell sequences)', () => {
  it('joins two cells into a two-character braille string', () => {
    // Numeric indicator (dots 3,4,5,6) + letter a (dot 1) = digit "1".
    expect(cellsToBraille([[3, 4, 5, 6], [1]])).toBe('⠼⠁');
  });

  it('returns an empty string for an empty cell list', () => {
    expect(cellsToBraille([])).toBe('');
  });
});

describe('Grade 1 alphabet a-z: known-correct UEB dot patterns', () => {
  // Reference: the standard UEB/Grade-1 braille alphabet. Independently
  // known dot patterns, not derived from the code under test.
  const knownAlphabet = {
    a: [1], b: [1, 2], c: [1, 4], d: [1, 4, 5], e: [1, 5],
    f: [1, 2, 4], g: [1, 2, 4, 5], h: [1, 2, 5], i: [2, 4], j: [2, 4, 5],
    k: [1, 3], l: [1, 2, 3], m: [1, 3, 4], n: [1, 3, 4, 5], o: [1, 3, 5],
    p: [1, 2, 3, 4], q: [1, 2, 3, 4, 5], r: [1, 2, 3, 5], s: [2, 3, 4],
    t: [2, 3, 4, 5], u: [1, 3, 6], v: [1, 2, 3, 6], w: [2, 4, 5, 6],
    x: [1, 3, 4, 6], y: [1, 3, 4, 5, 6], z: [1, 3, 5, 6],
  };

  for (const [letter, dots] of Object.entries(knownAlphabet)) {
    it(`maps "${letter}" to dots ${dots.join(',')}`, () => {
      const entry = findEntry(letter, 'alphabet');
      expect(entry.cells).toEqual([dots]);
      expect(cellsToBraille(entry.cells)).toBe(expectedBrailleChar(dots));
    });
  }
});

describe('Grade 1 digits 0-9: numeric indicator + letters a-j', () => {
  // Reference: UEB digits are the numeric indicator (dots 3,4,5,6) followed
  // by the letters a-j standing for 1-9 and 0 respectively.
  const numericIndicator = [3, 4, 5, 6];
  const knownDigits = {
    '1': [1], '2': [1, 2], '3': [1, 4], '4': [1, 4, 5], '5': [1, 5],
    '6': [1, 2, 4], '7': [1, 2, 4, 5], '8': [1, 2, 5], '9': [2, 4],
    '0': [2, 4, 5],
  };

  for (const [digit, letterDots] of Object.entries(knownDigits)) {
    it(`maps "${digit}" to the numeric indicator plus dots ${letterDots.join(',')}`, () => {
      const entry = findEntry(digit, 'number');
      expect(entry.cells).toEqual([numericIndicator, letterDots]);
    });
  }
});

describe('Grade 1 punctuation: known-correct UEB dot patterns', () => {
  const knownPunctuation = [
    { print: ',', dots: [2] },
    { print: ';', dots: [2, 3] },
    { print: ':', dots: [2, 5] },
    { print: '.', dots: [2, 5, 6] },
    { print: '!', dots: [2, 3, 5] },
    { print: '?', dots: [2, 3, 6] },
    { print: "'", dots: [3] },
    { print: '-', dots: [3, 6] },
  ];

  for (const { print, dots } of knownPunctuation) {
    it(`maps "${print}" to dots ${dots.join(',')}`, () => {
      const entry = findEntry(print, 'punctuation');
      expect(entry.cells).toEqual([dots]);
    });
  }

  it('maps the opening and closing double quotation marks to distinct, known cells', () => {
    const entries = data.filter((e) => e.print === '"' && e.category === 'punctuation');
    expect(entries).toHaveLength(2);
    const opening = entries.find((e) => e.notes.toLowerCase().includes('opening'));
    const closing = entries.find((e) => e.notes.toLowerCase().includes('closing'));
    // Opening double quote shares its cell with the question mark, per UEB.
    expect(opening.cells).toEqual([[2, 3, 6]]);
    expect(closing.cells).toEqual([[3, 5, 6]]);
  });
});

describe('Indicators: known-correct UEB dot patterns', () => {
  it('maps the numeric indicator to dots 3,4,5,6', () => {
    expect(findEntry('Numeric indicator', 'indicator').cells).toEqual([[3, 4, 5, 6]]);
  });

  it('maps the capital indicator to dot 6', () => {
    expect(findEntry('Capital indicator', 'indicator').cells).toEqual([[6]]);
  });

  it('maps the capital word indicator to two consecutive dot-6 cells', () => {
    expect(findEntry('Capital word indicator', 'indicator').cells).toEqual([[6], [6]]);
  });
});

describe('Grade 2 strong wordsigns and groupsigns: known-correct UEB dot patterns', () => {
  // Reference: the standard UEB strong wordsigns ("and", "for", "of",
  // "the", "with") and strong groupsigns (ch, gh, sh, th, wh, ed, er, ou,
  // ow, st, ar, ing), independently well-established contractions.
  const knownStrongSigns = [
    { print: 'and', category: 'strong-wordsign', dots: [1, 2, 3, 4, 6] },
    { print: 'for', category: 'strong-wordsign', dots: [1, 2, 3, 4, 5, 6] },
    { print: 'of', category: 'strong-wordsign', dots: [1, 2, 3, 5, 6] },
    { print: 'the', category: 'strong-wordsign', dots: [2, 3, 4, 6] },
    { print: 'with', category: 'strong-wordsign', dots: [2, 3, 4, 5, 6] },
    { print: 'ch', category: 'strong-groupsign', dots: [1, 6] },
    { print: 'gh', category: 'strong-groupsign', dots: [1, 2, 6] },
    { print: 'sh', category: 'strong-groupsign', dots: [1, 4, 6] },
    { print: 'th', category: 'strong-groupsign', dots: [1, 4, 5, 6] },
    { print: 'wh', category: 'strong-groupsign', dots: [1, 5, 6] },
    { print: 'st', category: 'strong-groupsign', dots: [3, 4] },
    { print: 'ar', category: 'strong-groupsign', dots: [3, 4, 5] },
    { print: 'ing', category: 'strong-groupsign', dots: [3, 4, 6] },
  ];

  for (const { print, category, dots } of knownStrongSigns) {
    it(`maps "${print}" to dots ${dots.join(',')}`, () => {
      const entry = findEntry(print, category);
      expect(entry.cells).toEqual([dots]);
    });
  }
});

describe('Grade 2 alphabetic wordsigns: single letter cell reused for a whole word', () => {
  // Reference: UEB alphabetic wordsigns reuse the plain Grade 1 letter
  // cell to stand for a whole word. Checked against the same known
  // alphabet dot patterns used in the Grade 1 alphabet tests above.
  const knownWordsigns = [
    { print: 'but', letterDots: [1, 2] },     // b
    { print: 'can', letterDots: [1, 4] },     // c
    { print: 'do', letterDots: [1, 4, 5] },   // d
    { print: 'so', letterDots: [2, 3, 4] },   // s
    { print: 'you', letterDots: [1, 3, 4, 5, 6] }, // y
  ];

  for (const { print, letterDots } of knownWordsigns) {
    it(`maps "${print}" to the same cell as its base letter (dots ${letterDots.join(',')})`, () => {
      const entry = findEntry(print, 'wordsign');
      expect(entry.cells).toEqual([letterDots]);
    });
  }
});

describe('describeCell', () => {
  it('describes an empty cell', () => {
    expect(describeCell([])).toBe('empty cell');
  });

  it('describes a single dot in the singular', () => {
    expect(describeCell([1])).toBe('dot 1');
  });

  it('describes multiple dots in the plural, comma-separated', () => {
    expect(describeCell([1, 2, 3])).toBe('dots 1, 2, 3');
  });
});

describe('cellsToDotsText', () => {
  it('describes a single-cell sequence without a "Cell N" prefix', () => {
    expect(cellsToDotsText([[1, 2]])).toBe('dots 1, 2');
  });

  it('describes a multi-cell sequence with numbered cell prefixes', () => {
    expect(cellsToDotsText([[3, 4, 5, 6], [1]])).toBe('Cell 1: dots 3, 4, 5, 6; Cell 2: dot 1');
  });
});

describe('categoryLabel', () => {
  it('maps every category used in the data set to a human-readable label', () => {
    const categoriesInUse = new Set(data.map((e) => e.category));
    for (const category of categoriesInUse) {
      const label = categoryLabel(category);
      expect(label).not.toBe(category); // every real category has a distinct label
      expect(typeof label).toBe('string');
      expect(label.length).toBeGreaterThan(0);
    }
  });

  it('falls back to the raw value for an unknown category', () => {
    expect(categoryLabel('not-a-real-category')).toBe('not-a-real-category');
  });
});

describe('parseDotInput: search-box parsing, including edge cases', () => {
  it('returns null for an empty string', () => {
    expect(parseDotInput('')).toBeNull();
  });

  it('returns null for whitespace only', () => {
    expect(parseDotInput('   ')).toBeNull();
  });

  it('returns null for undefined/falsy input', () => {
    expect(parseDotInput(undefined)).toBeNull();
    expect(parseDotInput(null)).toBeNull();
  });

  it('parses a single cell of digits into sorted, deduplicated dots', () => {
    expect(parseDotInput('321')).toEqual([[1, 2, 3]]);
  });

  it('deduplicates a repeated digit within one cell', () => {
    expect(parseDotInput('11223')).toEqual([[1, 2, 3]]);
  });

  it('parses multiple cells separated by a slash', () => {
    expect(parseDotInput('14/25')).toEqual([[1, 4], [2, 5]]);
  });

  it('ignores out-of-range and non-digit characters', () => {
    // 0, 7, 8, 9 are not valid dot numbers (dots run 1-6); letters are
    // ignored too, since parseInt on a non-digit character yields NaN.
    expect(parseDotInput('1a7b0')).toEqual([[1]]);
  });

  it('skips an empty cell between two slashes, keeping only non-empty cells', () => {
    expect(parseDotInput('1//2')).toEqual([[1], [2]]);
  });

  it('returns null when every cell is empty (e.g. only separators)', () => {
    expect(parseDotInput('/')).toBeNull();
    expect(parseDotInput('//')).toBeNull();
  });
});

describe('cellEqual', () => {
  it('treats two identical dot arrays as equal', () => {
    expect(cellEqual([1, 2, 3], [1, 2, 3])).toBe(true);
  });

  it('treats arrays of different length as unequal', () => {
    expect(cellEqual([1, 2], [1, 2, 3])).toBe(false);
  });

  it('treats same-length arrays with a differing element as unequal', () => {
    expect(cellEqual([1, 2, 3], [1, 2, 4])).toBe(false);
  });

  it('treats two empty arrays as equal', () => {
    expect(cellEqual([], [])).toBe(true);
  });
});

describe('cellsContain: dot-pattern search matching', () => {
  const haystack = [[3, 4, 5, 6], [1, 4, 5]]; // digit "4": numeric indicator + d

  it('finds a needle that matches the whole haystack', () => {
    expect(cellsContain(haystack, [[3, 4, 5, 6], [1, 4, 5]])).toBe(true);
  });

  it('finds a needle that matches a trailing subsequence', () => {
    expect(cellsContain(haystack, [[1, 4, 5]])).toBe(true);
  });

  it('finds a needle that matches a leading subsequence', () => {
    expect(cellsContain(haystack, [[3, 4, 5, 6]])).toBe(true);
  });

  it('returns false for a needle not present in the haystack', () => {
    expect(cellsContain(haystack, [[1, 2]])).toBe(false);
  });

  it('returns true for an empty needle (matches anything)', () => {
    expect(cellsContain(haystack, [])).toBe(true);
  });

  it('returns false when the needle is longer than the haystack', () => {
    expect(cellsContain([[1]], [[1], [2], [3]])).toBe(false);
  });
});

// ============================================================
// UNVERIFIED MAPPINGS — flagged, not asserted
// ============================================================
// The following categories in js/braille-data.js are NOT independently
// verified against a checked UEB reference in this test file, and are
// deliberately left untested rather than asserted against a guess:
//
//   - Punctuation: the two-cell round bracket sequences for "(" and ")"
//     ([[5],[1,2,6]] and [[5],[3,4,5]]). The single-cell UEB punctuation
//     above is well established; the exact two-cell bracket sequence is
//     not something this test author could confirm independently.
//   - category: "lower" (be, were, his, was, enough, in, con, dis, ea,
//     bb, cc, ff, gg) — UEB lower wordsigns/groupsigns.
//   - category: "initial-letter" (day, ever, father, here, know, lord,
//     mother, name, one, part, question, right, some, time, under, work,
//     young, there, character, through, where, ought, upon, these, those,
//     whose, word, cannot, had, many, spirit, their, world).
//   - category: "final-letter" (ound, ance, sion, less, ount, ence, ong,
//     ful, tion, ness, ment, ity).
//   - category: "shortform" (about, above, according, after, again,
//     because, before, between, could, friend, good, letter, little,
//     said, should, would, your).
//
// Recommendation: route these entries to Tad for verification against a
// canonical UEB rulebook or the Braille Authority of North America (BANA)
// UEB reference, then add assertions for them in a follow-up.
