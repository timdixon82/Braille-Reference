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
//      wordsigns, strong groupsigns, alphabetic wordsigns, round-bracket
//      punctuation, and the lower, initial-letter, final-letter, and
//      shortform categories. These are well-established, widely published
//      mappings, cross-checked here against the Unicode reference in (1)
//      above and against generally known UEB reference material. The
//      round-bracket and Grade 2 lower/initial-letter/final-letter/
//      shortform entries were verified against the Braille Authority of
//      North America (BANA) Appendix 1 and the ICEB Rules of Unified
//      English Braille, Third Edition 2024 (Tad's verification, work 050).

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

describe('Round-bracket punctuation: known-correct UEB dot patterns', () => {
  // Reference: Tad's UEB verification (work 050), cross-checked against
  // the BANA Appendix 1 "Braille Symbols and Indicators" (rule 7) and the
  // ICEB Rules of Unified English Braille, Third Edition 2024, section 7.
  // Round brackets always use this two-cell dot-5-prefix form; there is
  // no context-dependent variant, so a bare "(" or ")" is a valid case.
  it('maps "(" (opening round bracket) to dot 5 then dots 1, 2, 6', () => {
    expect(findEntry('(', 'punctuation').cells).toEqual([[5], [1, 2, 6]]);
  });

  it('maps ")" (closing round bracket) to dot 5 then dots 3, 4, 5', () => {
    expect(findEntry(')', 'punctuation').cells).toEqual([[5], [3, 4, 5]]);
  });
});

describe('Grade 2 lower wordsigns and groupsigns: known-correct UEB dot patterns', () => {
  // Reference: Tad's UEB verification (work 050), cross-checked against
  // BANA Appendix 1 rule-10.5/10.6 entries and ICEB Rules of UEB section
  // 10. Lower signs are drawn only from dots 2, 3, 5, 6.
  const knownLowerSigns = [
    { print: 'be', dots: [2, 3] },
    { print: 'were', dots: [2, 3, 5, 6] },
    { print: 'his', dots: [2, 3, 6] },
    { print: 'was', dots: [3, 5, 6] },
    { print: 'enough', dots: [2, 6] },
    { print: 'in', dots: [3, 5] },
    { print: 'con', dots: [2, 5] },
    { print: 'dis', dots: [2, 5, 6] },
    { print: 'ea', dots: [2] },
    { print: 'bb', dots: [2, 3] },
    { print: 'cc', dots: [2, 5] },
    { print: 'ff', dots: [2, 3, 5] },
    { print: 'gg', dots: [2, 3, 5, 6] },
  ];

  for (const { print, dots } of knownLowerSigns) {
    it(`maps "${print}" to dots ${dots.join(',')}`, () => {
      const entry = findEntry(print, 'lower');
      expect(entry.cells).toEqual([dots]);
    });
  }
});

describe('Grade 2 initial-letter contractions: known-correct UEB dot patterns', () => {
  // Reference: Tad's UEB verification (work 050), cross-checked against
  // BANA Appendix 1 rule-10.7 entries and ICEB Rules of UEB section 10.
  // Each is a fixed two-cell contraction: a prefix cell (dot 5, dots 4-5,
  // or dots 4-5-6) followed by a letter or lower-level contraction cell.
  const knownInitialLetterSigns = [
    { print: 'day', cells: [[5], [1, 4, 5]] },
    { print: 'ever', cells: [[5], [1, 5]] },
    { print: 'father', cells: [[5], [1, 2, 4]] },
    { print: 'here', cells: [[5], [1, 2, 5]] },
    { print: 'know', cells: [[5], [1, 3]] },
    { print: 'lord', cells: [[5], [1, 2, 3]] },
    { print: 'mother', cells: [[5], [1, 3, 4]] },
    { print: 'name', cells: [[5], [1, 3, 4, 5]] },
    { print: 'one', cells: [[5], [1, 3, 5]] },
    { print: 'part', cells: [[5], [1, 2, 3, 4]] },
    { print: 'question', cells: [[5], [1, 2, 3, 4, 5]] },
    { print: 'right', cells: [[5], [1, 2, 3, 5]] },
    { print: 'some', cells: [[5], [2, 3, 4]] },
    { print: 'time', cells: [[5], [2, 3, 4, 5]] },
    { print: 'under', cells: [[5], [1, 3, 6]] },
    { print: 'work', cells: [[5], [2, 4, 5, 6]] },
    { print: 'young', cells: [[5], [1, 3, 4, 5, 6]] },
    { print: 'there', cells: [[5], [2, 3, 4, 6]] },
    { print: 'character', cells: [[5], [1, 6]] },
    { print: 'through', cells: [[5], [1, 4, 5, 6]] },
    { print: 'where', cells: [[5], [1, 5, 6]] },
    { print: 'ought', cells: [[5], [1, 2, 5, 6]] },
    { print: 'upon', cells: [[4, 5], [1, 3, 6]] },
    { print: 'these', cells: [[4, 5], [2, 3, 4, 6]] },
    { print: 'those', cells: [[4, 5], [1, 4, 5, 6]] },
    { print: 'whose', cells: [[4, 5], [1, 5, 6]] },
    { print: 'word', cells: [[4, 5], [2, 4, 5, 6]] },
    { print: 'cannot', cells: [[4, 5, 6], [1, 4]] },
    { print: 'had', cells: [[4, 5, 6], [1, 2, 5]] },
    { print: 'many', cells: [[4, 5, 6], [1, 3, 4]] },
    { print: 'spirit', cells: [[4, 5, 6], [2, 3, 4]] },
    { print: 'their', cells: [[4, 5, 6], [2, 3, 4, 5]] },
    { print: 'world', cells: [[4, 5, 6], [2, 4, 5, 6]] },
  ];

  for (const { print, cells } of knownInitialLetterSigns) {
    it(`maps "${print}" to its verified initial-letter cells`, () => {
      expect(findEntry(print, 'initial-letter').cells).toEqual(cells);
    });
  }
});

describe('Grade 2 final-letter contractions: known-correct UEB dot patterns', () => {
  // Reference: Tad's UEB verification (work 050), cross-checked against
  // BANA Appendix 1 rule-10.8 entries and ICEB Rules of UEB section 10.
  // Each is a two-cell contraction: a prefix cell (dots 4-6 or dots 5-6)
  // followed by a letter cell, valid only as a word-final letter group
  // (e.g. "found", "balance", "version" — not mid-word or word-initial).
  const knownFinalLetterSigns = [
    { print: 'ound', cells: [[4, 6], [1, 4, 5]] },
    { print: 'ance', cells: [[4, 6], [1, 5]] },
    { print: 'sion', cells: [[4, 6], [1, 3, 4, 5]] },
    { print: 'less', cells: [[4, 6], [2, 3, 4]] },
    { print: 'ount', cells: [[4, 6], [2, 3, 4, 5]] },
    { print: 'ence', cells: [[5, 6], [1, 5]] },
    { print: 'ong', cells: [[5, 6], [1, 2, 4, 5]] },
    { print: 'ful', cells: [[5, 6], [1, 2, 3]] },
    { print: 'tion', cells: [[5, 6], [1, 3, 4, 5]] },
    { print: 'ness', cells: [[5, 6], [2, 3, 4]] },
    { print: 'ment', cells: [[5, 6], [2, 3, 4, 5]] },
    { print: 'ity', cells: [[5, 6], [1, 3, 4, 5, 6]] },
  ];

  for (const { print, cells } of knownFinalLetterSigns) {
    it(`maps "${print}" to its verified final-letter cells`, () => {
      expect(findEntry(print, 'final-letter').cells).toEqual(cells);
    });
  }
});

describe('Grade 2 shortforms: known-correct UEB dot patterns', () => {
  // Reference: Tad's UEB verification (work 050), cross-checked against
  // BANA Appendix 1 rule-10.9 entries and ICEB Rules of UEB section 10.
  // Each shortform is a fixed abbreviation built from letter or lower-sign
  // cells; the base word itself is the safe, unambiguous test case.
  const knownShortforms = [
    { print: 'about', cells: [[1], [1, 2]] },
    { print: 'above', cells: [[1], [1, 2], [1, 2, 3, 6]] },
    { print: 'according', cells: [[1], [1, 4]] },
    { print: 'after', cells: [[1], [1, 2, 4]] },
    { print: 'again', cells: [[1], [1, 2, 4, 5]] },
    { print: 'because', cells: [[2, 3], [1, 4]] },
    { print: 'before', cells: [[2, 3], [1, 2, 4]] },
    { print: 'between', cells: [[2, 3], [2, 3, 4, 5]] },
    { print: 'could', cells: [[1, 4], [1, 4, 5]] },
    { print: 'friend', cells: [[1, 2, 4], [1, 2, 3, 5]] },
    { print: 'good', cells: [[1, 2, 4, 5], [1, 4, 5]] },
    { print: 'letter', cells: [[1, 2, 3], [1, 2, 3, 5]] },
    { print: 'little', cells: [[1, 2, 3], [1, 2, 3]] },
    { print: 'said', cells: [[2, 3, 4], [1, 4, 5]] },
    { print: 'should', cells: [[1, 4, 6], [1, 4, 5]] },
    { print: 'would', cells: [[2, 4, 5, 6], [1, 4, 5]] },
    { print: 'your', cells: [[1, 3, 4, 5, 6], [1, 2, 3, 5]] },
  ];

  for (const { print, cells } of knownShortforms) {
    it(`maps "${print}" to its verified shortform cells`, () => {
      expect(findEntry(print, 'shortform').cells).toEqual(cells);
    });
  }
});
