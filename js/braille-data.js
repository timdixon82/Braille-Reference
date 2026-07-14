// ============================================================
// UEB Braille data and pure conversion helpers
// ============================================================
// Extracted from index.html (work 050) so the character-to-braille
// mapping and lookup functions can be unit tested in isolation. This
// is a minimal, behaviour-preserving extraction of the data set and
// the DOM-free helper functions only; the rendering, filtering, and
// event-wiring code stays inline in index.html for now. It is step 1
// of the incremental multi-file structure accepted in
// docs/decisions/005-incremental-multi-file-structure.md — see that
// record and the note in the pull request that introduced this file.
//
// Each data entry: { print, cells, category, notes, grade }
// grade: 1 = shown in both grades; 2 = shown in Grade 2 only
// cells: array of cells; each cell is an array of dot numbers (1-6)

export const data = [
  // ----- Alphabet (always shown) -----
  { print: 'a', cells: [[1]],         category: 'alphabet', grade: 1, notes: 'Letter A. Also represents the digit 1 when preceded by the numeric indicator.' },
  { print: 'b', cells: [[1,2]],       category: 'alphabet', grade: 1, notes: 'Letter B.' },
  { print: 'c', cells: [[1,4]],       category: 'alphabet', grade: 1, notes: 'Letter C.' },
  { print: 'd', cells: [[1,4,5]],     category: 'alphabet', grade: 1, notes: 'Letter D.' },
  { print: 'e', cells: [[1,5]],       category: 'alphabet', grade: 1, notes: 'Letter E.' },
  { print: 'f', cells: [[1,2,4]],     category: 'alphabet', grade: 1, notes: 'Letter F.' },
  { print: 'g', cells: [[1,2,4,5]],   category: 'alphabet', grade: 1, notes: 'Letter G.' },
  { print: 'h', cells: [[1,2,5]],     category: 'alphabet', grade: 1, notes: 'Letter H.' },
  { print: 'i', cells: [[2,4]],       category: 'alphabet', grade: 1, notes: 'Letter I.' },
  { print: 'j', cells: [[2,4,5]],     category: 'alphabet', grade: 1, notes: 'Letter J.' },
  { print: 'k', cells: [[1,3]],       category: 'alphabet', grade: 1, notes: 'Letter K.' },
  { print: 'l', cells: [[1,2,3]],     category: 'alphabet', grade: 1, notes: 'Letter L.' },
  { print: 'm', cells: [[1,3,4]],     category: 'alphabet', grade: 1, notes: 'Letter M.' },
  { print: 'n', cells: [[1,3,4,5]],   category: 'alphabet', grade: 1, notes: 'Letter N.' },
  { print: 'o', cells: [[1,3,5]],     category: 'alphabet', grade: 1, notes: 'Letter O.' },
  { print: 'p', cells: [[1,2,3,4]],   category: 'alphabet', grade: 1, notes: 'Letter P.' },
  { print: 'q', cells: [[1,2,3,4,5]], category: 'alphabet', grade: 1, notes: 'Letter Q.' },
  { print: 'r', cells: [[1,2,3,5]],   category: 'alphabet', grade: 1, notes: 'Letter R.' },
  { print: 's', cells: [[2,3,4]],     category: 'alphabet', grade: 1, notes: 'Letter S.' },
  { print: 't', cells: [[2,3,4,5]],   category: 'alphabet', grade: 1, notes: 'Letter T.' },
  { print: 'u', cells: [[1,3,6]],     category: 'alphabet', grade: 1, notes: 'Letter U.' },
  { print: 'v', cells: [[1,2,3,6]],   category: 'alphabet', grade: 1, notes: 'Letter V.' },
  { print: 'w', cells: [[2,4,5,6]],   category: 'alphabet', grade: 1, notes: 'Letter W. Note that W breaks the alphabetic pattern because Louis Braille devised the system in French, where W was uncommon.' },
  { print: 'x', cells: [[1,3,4,6]],   category: 'alphabet', grade: 1, notes: 'Letter X.' },
  { print: 'y', cells: [[1,3,4,5,6]], category: 'alphabet', grade: 1, notes: 'Letter Y.' },
  { print: 'z', cells: [[1,3,5,6]],   category: 'alphabet', grade: 1, notes: 'Letter Z.' },

  // ----- Numbers -----
  { print: '0', cells: [[3,4,5,6],[2,4,5]], category: 'number', grade: 1, notes: 'Digit 0. Numeric indicator followed by the letter j.' },
  { print: '1', cells: [[3,4,5,6],[1]],     category: 'number', grade: 1, notes: 'Digit 1. Numeric indicator followed by the letter a.' },
  { print: '2', cells: [[3,4,5,6],[1,2]],   category: 'number', grade: 1, notes: 'Digit 2. Numeric indicator followed by the letter b.' },
  { print: '3', cells: [[3,4,5,6],[1,4]],   category: 'number', grade: 1, notes: 'Digit 3. Numeric indicator followed by the letter c.' },
  { print: '4', cells: [[3,4,5,6],[1,4,5]], category: 'number', grade: 1, notes: 'Digit 4. Numeric indicator followed by the letter d.' },
  { print: '5', cells: [[3,4,5,6],[1,5]],   category: 'number', grade: 1, notes: 'Digit 5. Numeric indicator followed by the letter e.' },
  { print: '6', cells: [[3,4,5,6],[1,2,4]], category: 'number', grade: 1, notes: 'Digit 6. Numeric indicator followed by the letter f.' },
  { print: '7', cells: [[3,4,5,6],[1,2,4,5]], category: 'number', grade: 1, notes: 'Digit 7. Numeric indicator followed by the letter g.' },
  { print: '8', cells: [[3,4,5,6],[1,2,5]], category: 'number', grade: 1, notes: 'Digit 8. Numeric indicator followed by the letter h.' },
  { print: '9', cells: [[3,4,5,6],[2,4]],   category: 'number', grade: 1, notes: 'Digit 9. Numeric indicator followed by the letter i.' },

  // ----- Punctuation -----
  { print: ',', cells: [[2]],     category: 'punctuation', grade: 1, notes: 'Comma.' },
  { print: ';', cells: [[2,3]],   category: 'punctuation', grade: 1, notes: 'Semicolon.' },
  { print: ':', cells: [[2,5]],   category: 'punctuation', grade: 1, notes: 'Colon.' },
  { print: '.', cells: [[2,5,6]], category: 'punctuation', grade: 1, notes: 'Full stop (period).' },
  { print: '!', cells: [[2,3,5]], category: 'punctuation', grade: 1, notes: 'Exclamation mark.' },
  { print: '?', cells: [[2,3,6]], category: 'punctuation', grade: 1, notes: 'Question mark. Also serves as the opening single quotation mark in UEB.' },
  { print: "'", cells: [[3]],     category: 'punctuation', grade: 1, notes: 'Apostrophe.' },
  { print: '-', cells: [[3,6]],   category: 'punctuation', grade: 1, notes: 'Hyphen.' },
  { print: '"', cells: [[2,3,6]], category: 'punctuation', grade: 1, notes: 'Opening double quotation mark.' },
  { print: '"', cells: [[3,5,6]], category: 'punctuation', grade: 1, notes: 'Closing double quotation mark.' },
  { print: '(', cells: [[5],[1,2,6]], category: 'punctuation', grade: 1, notes: 'Opening round bracket (parenthesis). Two cells: dot 5 then dots 1, 2, 6.' },
  { print: ')', cells: [[5],[3,4,5]], category: 'punctuation', grade: 1, notes: 'Closing round bracket (parenthesis). Two cells: dot 5 then dots 3, 4, 5.' },

  // ----- Indicators -----
  { print: 'Capital indicator', cells: [[6]],         category: 'indicator', grade: 1, notes: 'Indicates that the following single letter is capitalised.' },
  { print: 'Capital word indicator', cells: [[6],[6]], category: 'indicator', grade: 1, notes: 'Indicates that the following whole word is capitalised. Two consecutive dot 6 cells.' },
  { print: 'Capital passage indicator', cells: [[6],[6],[6]], category: 'indicator', grade: 1, notes: 'Indicates a capitalised passage of three or more words. Three consecutive dot 6 cells.' },
  { print: 'Numeric indicator', cells: [[3,4,5,6]],   category: 'indicator', grade: 1, notes: 'Indicates that the following letters a–j represent the digits 1–9 and 0.' },
  { print: 'Grade 1 indicator', cells: [[5,6]],       category: 'indicator', grade: 1, notes: 'Forces the following symbol to be read in Grade 1 (uncontracted). Used to disambiguate where a letter could otherwise be misread as a contraction.' },
  { print: 'Italic symbol indicator', cells: [[4,6]], category: 'indicator', grade: 1, notes: 'Indicates that the following single symbol is italic.' },
  { print: 'Bold symbol indicator', cells: [[4,5,6]], category: 'indicator', grade: 1, notes: 'Indicates that the following single symbol is bold.' },

  // ============================================================
  // GRADE 2 — Alphabetic wordsigns (single letter = whole word)
  // ============================================================
  { print: 'but',       cells: [[1,2]],       category: 'wordsign', grade: 2, notes: 'Alphabetic wordsign. The letter b standing alone represents the word "but".' },
  { print: 'can',       cells: [[1,4]],       category: 'wordsign', grade: 2, notes: 'Alphabetic wordsign. The letter c standing alone represents the word "can".' },
  { print: 'do',        cells: [[1,4,5]],     category: 'wordsign', grade: 2, notes: 'Alphabetic wordsign. The letter d standing alone represents the word "do".' },
  { print: 'every',     cells: [[1,5]],       category: 'wordsign', grade: 2, notes: 'Alphabetic wordsign. The letter e standing alone represents the word "every".' },
  { print: 'from',      cells: [[1,2,4]],     category: 'wordsign', grade: 2, notes: 'Alphabetic wordsign. The letter f standing alone represents the word "from".' },
  { print: 'go',        cells: [[1,2,4,5]],   category: 'wordsign', grade: 2, notes: 'Alphabetic wordsign. The letter g standing alone represents the word "go".' },
  { print: 'have',      cells: [[1,2,5]],     category: 'wordsign', grade: 2, notes: 'Alphabetic wordsign. The letter h standing alone represents the word "have".' },
  { print: 'just',      cells: [[2,4,5]],     category: 'wordsign', grade: 2, notes: 'Alphabetic wordsign. The letter j standing alone represents the word "just".' },
  { print: 'knowledge', cells: [[1,3]],       category: 'wordsign', grade: 2, notes: 'Alphabetic wordsign. The letter k standing alone represents the word "knowledge".' },
  { print: 'like',      cells: [[1,2,3]],     category: 'wordsign', grade: 2, notes: 'Alphabetic wordsign. The letter l standing alone represents the word "like".' },
  { print: 'more',      cells: [[1,3,4]],     category: 'wordsign', grade: 2, notes: 'Alphabetic wordsign. The letter m standing alone represents the word "more".' },
  { print: 'not',       cells: [[1,3,4,5]],   category: 'wordsign', grade: 2, notes: 'Alphabetic wordsign. The letter n standing alone represents the word "not".' },
  { print: 'people',    cells: [[1,2,3,4]],   category: 'wordsign', grade: 2, notes: 'Alphabetic wordsign. The letter p standing alone represents the word "people".' },
  { print: 'quite',     cells: [[1,2,3,4,5]], category: 'wordsign', grade: 2, notes: 'Alphabetic wordsign. The letter q standing alone represents the word "quite".' },
  { print: 'rather',    cells: [[1,2,3,5]],   category: 'wordsign', grade: 2, notes: 'Alphabetic wordsign. The letter r standing alone represents the word "rather".' },
  { print: 'so',        cells: [[2,3,4]],     category: 'wordsign', grade: 2, notes: 'Alphabetic wordsign. The letter s standing alone represents the word "so".' },
  { print: 'that',      cells: [[2,3,4,5]],   category: 'wordsign', grade: 2, notes: 'Alphabetic wordsign. The letter t standing alone represents the word "that".' },
  { print: 'us',        cells: [[1,3,6]],     category: 'wordsign', grade: 2, notes: 'Alphabetic wordsign. The letter u standing alone represents the word "us".' },
  { print: 'very',      cells: [[1,2,3,6]],   category: 'wordsign', grade: 2, notes: 'Alphabetic wordsign. The letter v standing alone represents the word "very".' },
  { print: 'will',      cells: [[2,4,5,6]],   category: 'wordsign', grade: 2, notes: 'Alphabetic wordsign. The letter w standing alone represents the word "will".' },
  { print: 'it',        cells: [[1,3,4,6]],   category: 'wordsign', grade: 2, notes: 'Alphabetic wordsign. The letter x standing alone represents the word "it".' },
  { print: 'you',       cells: [[1,3,4,5,6]], category: 'wordsign', grade: 2, notes: 'Alphabetic wordsign. The letter y standing alone represents the word "you".' },
  { print: 'as',        cells: [[1,3,5,6]],   category: 'wordsign', grade: 2, notes: 'Alphabetic wordsign. The letter z standing alone represents the word "as".' },

  // ============================================================
  // GRADE 2 — Strong wordsigns (whole word, single non-letter cell)
  // ============================================================
  { print: 'and',  cells: [[1,2,3,4,6]],   category: 'strong-wordsign', grade: 2, notes: 'Strong wordsign and groupsign for "and". Single cell.' },
  { print: 'for',  cells: [[1,2,3,4,5,6]], category: 'strong-wordsign', grade: 2, notes: 'Strong wordsign and groupsign for "for". A full cell — all six dots.' },
  { print: 'of',   cells: [[1,2,3,5,6]],   category: 'strong-wordsign', grade: 2, notes: 'Strong wordsign and groupsign for "of".' },
  { print: 'the',  cells: [[2,3,4,6]],     category: 'strong-wordsign', grade: 2, notes: 'Strong wordsign and groupsign for "the".' },
  { print: 'with', cells: [[2,3,4,5,6]],   category: 'strong-wordsign', grade: 2, notes: 'Strong wordsign and groupsign for "with".' },

  // ============================================================
  // GRADE 2 — Strong groupsigns (any position in a word)
  // ============================================================
  { print: 'ch',  cells: [[1,6]],     category: 'strong-groupsign', grade: 2, notes: 'Strong groupsign for "ch". Used anywhere in a word, e.g. "rich", "child".' },
  { print: 'gh',  cells: [[1,2,6]],   category: 'strong-groupsign', grade: 2, notes: 'Strong groupsign for "gh". Used anywhere in a word, e.g. "ghost", "though".' },
  { print: 'sh',  cells: [[1,4,6]],   category: 'strong-groupsign', grade: 2, notes: 'Strong groupsign for "sh". Used anywhere in a word, e.g. "ship", "wish".' },
  { print: 'th',  cells: [[1,4,5,6]], category: 'strong-groupsign', grade: 2, notes: 'Strong groupsign for "th". Used anywhere in a word, e.g. "this", "with".' },
  { print: 'wh',  cells: [[1,5,6]],   category: 'strong-groupsign', grade: 2, notes: 'Strong groupsign for "wh". Used anywhere in a word, e.g. "what", "while".' },
  { print: 'ed',  cells: [[1,2,4,6]], category: 'strong-groupsign', grade: 2, notes: 'Strong groupsign for "ed". Used anywhere in a word, e.g. "edge", "walked".' },
  { print: 'er',  cells: [[1,2,4,5,6]], category: 'strong-groupsign', grade: 2, notes: 'Strong groupsign for "er". Used anywhere in a word, e.g. "enter", "her".' },
  { print: 'ou',  cells: [[1,2,5,6]], category: 'strong-groupsign', grade: 2, notes: 'Strong groupsign for "ou". Used anywhere in a word, e.g. "out", "around".' },
  { print: 'ow',  cells: [[2,4,6]],   category: 'strong-groupsign', grade: 2, notes: 'Strong groupsign for "ow". Used anywhere in a word, e.g. "now", "owner".' },
  { print: 'st',  cells: [[3,4]],     category: 'strong-groupsign', grade: 2, notes: 'Strong groupsign for "st". Used anywhere in a word, e.g. "still", "first".' },
  { print: 'ar',  cells: [[3,4,5]],   category: 'strong-groupsign', grade: 2, notes: 'Strong groupsign for "ar". Used anywhere in a word, e.g. "arm", "garden".' },
  { print: 'ing', cells: [[3,4,6]],   category: 'strong-groupsign', grade: 2, notes: 'Strong groupsign for "ing". Cannot be used at the start of a word, e.g. "going", "thing".' },

  // ============================================================
  // GRADE 2 — Lower wordsigns and groupsigns
  // ============================================================
  { print: 'be',   cells: [[2,3]],     category: 'lower', grade: 2, notes: 'Lower wordsign for "be" when standing alone. Also a lower groupsign at the start of a word, e.g. "before".' },
  { print: 'were', cells: [[2,3,5,6]], category: 'lower', grade: 2, notes: 'Lower wordsign for "were" when standing alone.' },
  { print: 'his',  cells: [[2,3,6]],   category: 'lower', grade: 2, notes: 'Lower wordsign for "his" when standing alone. Note: shares the same cell as the question mark and opening single quote.' },
  { print: 'was',  cells: [[3,5,6]],   category: 'lower', grade: 2, notes: 'Lower wordsign for "was" when standing alone.' },
  { print: 'enough', cells: [[2,6]],   category: 'lower', grade: 2, notes: 'Lower wordsign for "enough" when standing alone.' },
  { print: 'in',   cells: [[3,5]],     category: 'lower', grade: 2, notes: 'Lower wordsign for "in" when standing alone. Also a lower groupsign within words, e.g. "into".' },
  { print: 'con',  cells: [[2,5]],     category: 'lower', grade: 2, notes: 'Lower groupsign for "con" at the start of a word, e.g. "consider". Same cell as the colon.' },
  { print: 'dis',  cells: [[2,5,6]],   category: 'lower', grade: 2, notes: 'Lower groupsign for "dis" at the start of a word, e.g. "discover". Same cell as the full stop.' },
  { print: 'ea',   cells: [[2]],       category: 'lower', grade: 2, notes: 'Lower groupsign for "ea" in the middle of a word, e.g. "great". Same cell as the comma.' },
  { print: 'bb',   cells: [[2,3]],     category: 'lower', grade: 2, notes: 'Lower groupsign for "bb" in the middle of a word, e.g. "rabbit".' },
  { print: 'cc',   cells: [[2,5]],     category: 'lower', grade: 2, notes: 'Lower groupsign for "cc" in the middle of a word, e.g. "accept".' },
  { print: 'ff',   cells: [[2,3,5]],   category: 'lower', grade: 2, notes: 'Lower groupsign for "ff" in the middle of a word, e.g. "offer".' },
  { print: 'gg',   cells: [[2,3,5,6]], category: 'lower', grade: 2, notes: 'Lower groupsign for "gg" in the middle of a word, e.g. "egg".' },

  // ============================================================
  // GRADE 2 — Initial-letter contractions (with dot 5 prefix)
  // ============================================================
  { print: 'day',       cells: [[5],[1,4,5]],     category: 'initial-letter', grade: 2, notes: 'Dot 5 plus letter d. Word: "day".' },
  { print: 'ever',      cells: [[5],[1,5]],       category: 'initial-letter', grade: 2, notes: 'Dot 5 plus letter e. Word: "ever".' },
  { print: 'father',    cells: [[5],[1,2,4]],     category: 'initial-letter', grade: 2, notes: 'Dot 5 plus letter f. Word: "father".' },
  { print: 'here',      cells: [[5],[1,2,5]],     category: 'initial-letter', grade: 2, notes: 'Dot 5 plus letter h. Word: "here".' },
  { print: 'know',      cells: [[5],[1,3]],       category: 'initial-letter', grade: 2, notes: 'Dot 5 plus letter k. Word: "know".' },
  { print: 'lord',      cells: [[5],[1,2,3]],     category: 'initial-letter', grade: 2, notes: 'Dot 5 plus letter l. Word: "lord".' },
  { print: 'mother',    cells: [[5],[1,3,4]],     category: 'initial-letter', grade: 2, notes: 'Dot 5 plus letter m. Word: "mother".' },
  { print: 'name',      cells: [[5],[1,3,4,5]],   category: 'initial-letter', grade: 2, notes: 'Dot 5 plus letter n. Word: "name".' },
  { print: 'one',       cells: [[5],[1,3,5]],     category: 'initial-letter', grade: 2, notes: 'Dot 5 plus letter o. Word: "one".' },
  { print: 'part',      cells: [[5],[1,2,3,4]],   category: 'initial-letter', grade: 2, notes: 'Dot 5 plus letter p. Word: "part".' },
  { print: 'question',  cells: [[5],[1,2,3,4,5]], category: 'initial-letter', grade: 2, notes: 'Dot 5 plus letter q. Word: "question".' },
  { print: 'right',     cells: [[5],[1,2,3,5]],   category: 'initial-letter', grade: 2, notes: 'Dot 5 plus letter r. Word: "right".' },
  { print: 'some',      cells: [[5],[2,3,4]],     category: 'initial-letter', grade: 2, notes: 'Dot 5 plus letter s. Word: "some".' },
  { print: 'time',      cells: [[5],[2,3,4,5]],   category: 'initial-letter', grade: 2, notes: 'Dot 5 plus letter t. Word: "time".' },
  { print: 'under',     cells: [[5],[1,3,6]],     category: 'initial-letter', grade: 2, notes: 'Dot 5 plus letter u. Word: "under".' },
  { print: 'work',      cells: [[5],[2,4,5,6]],   category: 'initial-letter', grade: 2, notes: 'Dot 5 plus letter w. Word: "work".' },
  { print: 'young',     cells: [[5],[1,3,4,5,6]], category: 'initial-letter', grade: 2, notes: 'Dot 5 plus letter y. Word: "young".' },
  { print: 'there',     cells: [[5],[2,3,4,6]],   category: 'initial-letter', grade: 2, notes: 'Dot 5 plus the contraction "the". Word: "there".' },
  { print: 'character', cells: [[5],[1,6]],       category: 'initial-letter', grade: 2, notes: 'Dot 5 plus the contraction "ch". Word: "character".' },
  { print: 'through',   cells: [[5],[1,4,5,6]],   category: 'initial-letter', grade: 2, notes: 'Dot 5 plus the contraction "th". Word: "through".' },
  { print: 'where',     cells: [[5],[1,5,6]],     category: 'initial-letter', grade: 2, notes: 'Dot 5 plus the contraction "wh". Word: "where".' },
  { print: 'ought',     cells: [[5],[1,2,5,6]],   category: 'initial-letter', grade: 2, notes: 'Dot 5 plus the contraction "ou". Word: "ought".' },

  // Initial-letter contractions (with dots 4-5 prefix)
  { print: 'upon',  cells: [[4,5],[1,3,6]],   category: 'initial-letter', grade: 2, notes: 'Dots 4, 5 plus letter u. Word: "upon".' },
  { print: 'these', cells: [[4,5],[2,3,4,6]], category: 'initial-letter', grade: 2, notes: 'Dots 4, 5 plus the contraction "the". Word: "these".' },
  { print: 'those', cells: [[4,5],[1,4,5,6]], category: 'initial-letter', grade: 2, notes: 'Dots 4, 5 plus the contraction "th". Word: "those".' },
  { print: 'whose', cells: [[4,5],[1,5,6]],   category: 'initial-letter', grade: 2, notes: 'Dots 4, 5 plus the contraction "wh". Word: "whose".' },
  { print: 'word',  cells: [[4,5],[2,4,5,6]], category: 'initial-letter', grade: 2, notes: 'Dots 4, 5 plus letter w. Word: "word".' },

  // Initial-letter contractions (with dots 4-5-6 prefix)
  { print: 'cannot', cells: [[4,5,6],[1,4]],   category: 'initial-letter', grade: 2, notes: 'Dots 4, 5, 6 plus letter c. Word: "cannot".' },
  { print: 'had',    cells: [[4,5,6],[1,2,5]], category: 'initial-letter', grade: 2, notes: 'Dots 4, 5, 6 plus letter h. Word: "had".' },
  { print: 'many',   cells: [[4,5,6],[1,3,4]], category: 'initial-letter', grade: 2, notes: 'Dots 4, 5, 6 plus letter m. Word: "many".' },
  { print: 'spirit', cells: [[4,5,6],[2,3,4]], category: 'initial-letter', grade: 2, notes: 'Dots 4, 5, 6 plus letter s. Word: "spirit".' },
  { print: 'their',  cells: [[4,5,6],[2,3,4,5]], category: 'initial-letter', grade: 2, notes: 'Dots 4, 5, 6 plus letter t. Word: "their".' },
  { print: 'world',  cells: [[4,5,6],[2,4,5,6]], category: 'initial-letter', grade: 2, notes: 'Dots 4, 5, 6 plus letter w. Word: "world".' },

  // ============================================================
  // GRADE 2 — Final-letter contractions
  // ============================================================
  { print: 'ound', cells: [[4,6],[1,4,5]], category: 'final-letter', grade: 2, notes: 'Dots 4, 6 plus letter d. Final-letter group "ound", e.g. "found".' },
  { print: 'ance', cells: [[4,6],[1,5]],   category: 'final-letter', grade: 2, notes: 'Dots 4, 6 plus letter e. Final-letter group "ance", e.g. "balance".' },
  { print: 'sion', cells: [[4,6],[1,3,4,5]], category: 'final-letter', grade: 2, notes: 'Dots 4, 6 plus letter n. Final-letter group "sion", e.g. "version".' },
  { print: 'less', cells: [[4,6],[2,3,4]], category: 'final-letter', grade: 2, notes: 'Dots 4, 6 plus letter s. Final-letter group "less", e.g. "useless".' },
  { print: 'ount', cells: [[4,6],[2,3,4,5]], category: 'final-letter', grade: 2, notes: 'Dots 4, 6 plus letter t. Final-letter group "ount", e.g. "count".' },
  { print: 'ence', cells: [[5,6],[1,5]],   category: 'final-letter', grade: 2, notes: 'Dots 5, 6 plus letter e. Final-letter group "ence", e.g. "silence".' },
  { print: 'ong',  cells: [[5,6],[1,2,4,5]], category: 'final-letter', grade: 2, notes: 'Dots 5, 6 plus letter g. Final-letter group "ong", e.g. "song".' },
  { print: 'ful',  cells: [[5,6],[1,2,3]], category: 'final-letter', grade: 2, notes: 'Dots 5, 6 plus letter l. Final-letter group "ful", e.g. "useful".' },
  { print: 'tion', cells: [[5,6],[1,3,4,5]], category: 'final-letter', grade: 2, notes: 'Dots 5, 6 plus letter n. Final-letter group "tion", e.g. "action".' },
  { print: 'ness', cells: [[5,6],[2,3,4]], category: 'final-letter', grade: 2, notes: 'Dots 5, 6 plus letter s. Final-letter group "ness", e.g. "kindness".' },
  { print: 'ment', cells: [[5,6],[2,3,4,5]], category: 'final-letter', grade: 2, notes: 'Dots 5, 6 plus letter t. Final-letter group "ment", e.g. "moment".' },
  { print: 'ity',  cells: [[5,6],[1,3,4,5,6]], category: 'final-letter', grade: 2, notes: 'Dots 5, 6 plus letter y. Final-letter group "ity", e.g. "ability".' },

  // ============================================================
  // GRADE 2 — Common shortforms
  // ============================================================
  { print: 'about',     cells: [[1],[1,2]], category: 'shortform', grade: 2, notes: 'Shortform: a + b.' },
  { print: 'above',     cells: [[1],[1,2],[1,2,3,6]], category: 'shortform', grade: 2, notes: 'Shortform: a + b + v.' },
  { print: 'according', cells: [[1],[1,4]], category: 'shortform', grade: 2, notes: 'Shortform: a + c.' },
  { print: 'after',     cells: [[1],[1,2,4]], category: 'shortform', grade: 2, notes: 'Shortform: a + f.' },
  { print: 'again',     cells: [[1],[1,2,4,5]], category: 'shortform', grade: 2, notes: 'Shortform: a + g.' },
  { print: 'because',   cells: [[2,3],[1,4]], category: 'shortform', grade: 2, notes: 'Shortform: be + c. The "be" lower contraction acts as the start of the word.' },
  { print: 'before',    cells: [[2,3],[1,2,4]], category: 'shortform', grade: 2, notes: 'Shortform: be + f.' },
  { print: 'between',   cells: [[2,3],[2,3,4,5]], category: 'shortform', grade: 2, notes: 'Shortform: be + t.' },
  { print: 'could',     cells: [[1,4],[1,4,5]], category: 'shortform', grade: 2, notes: 'Shortform: c + d.' },
  { print: 'friend',    cells: [[1,2,4],[1,2,3,5]], category: 'shortform', grade: 2, notes: 'Shortform: f + r.' },
  { print: 'good',      cells: [[1,2,4,5],[1,4,5]], category: 'shortform', grade: 2, notes: 'Shortform: g + d.' },
  { print: 'letter',    cells: [[1,2,3],[1,2,3,5]], category: 'shortform', grade: 2, notes: 'Shortform: l + r.' },
  { print: 'little',    cells: [[1,2,3],[1,2,3]], category: 'shortform', grade: 2, notes: 'Shortform: l + l.' },
  { print: 'said',      cells: [[2,3,4],[1,4,5]], category: 'shortform', grade: 2, notes: 'Shortform: s + d.' },
  { print: 'should',    cells: [[1,4,6],[1,4,5]], category: 'shortform', grade: 2, notes: 'Shortform: sh + d. Uses the "sh" contraction.' },
  { print: 'would',     cells: [[2,4,5,6],[1,4,5]], category: 'shortform', grade: 2, notes: 'Shortform: w + d.' },
  { print: 'your',      cells: [[1,3,4,5,6],[1,2,3,5]], category: 'shortform', grade: 2, notes: 'Shortform: y + r.' },
];

// ============================================================
// Helpers
// ============================================================
export function dotsToChar(dots) {
  let offset = 0;
  for (const d of dots) offset |= 1 << (d - 1);
  return String.fromCharCode(0x2800 + offset);
}

export function cellsToBraille(cells) {
  return cells.map(dotsToChar).join('');
}

export function describeCell(c) {
  if (c.length === 0) return 'empty cell';
  if (c.length === 1) return `dot ${c[0]}`;
  return `dots ${c.join(', ')}`;
}

export function cellsToDotsText(cells) {
  if (cells.length === 1) return describeCell(cells[0]);
  return cells.map((c, i) => `Cell ${i+1}: ${describeCell(c)}`).join('; ');
}

export function categoryLabel(cat) {
  return ({
    'alphabet': 'Alphabet',
    'number': 'Number',
    'punctuation': 'Punctuation',
    'indicator': 'Indicator',
    'wordsign': 'Wordsign',
    'strong-wordsign': 'Strong wordsign',
    'strong-groupsign': 'Strong groupsign',
    'lower': 'Lower contraction',
    'initial-letter': 'Initial-letter',
    'final-letter': 'Final-letter',
    'shortform': 'Shortform',
  })[cat] || cat;
}

// Parse user input for dot-pattern search.
// Returns: array of cells (each cell is sorted unique dots 1-6), or null if empty.
export function parseDotInput(input) {
  if (!input || !input.trim()) return null;
  const cellStrings = input.split('/');
  const cells = [];
  for (const s of cellStrings) {
    const dots = [];
    for (const ch of s) {
      const d = parseInt(ch, 10);
      if (d >= 1 && d <= 6 && !dots.includes(d)) dots.push(d);
    }
    if (dots.length > 0) {
      dots.sort((a,b) => a - b);
      cells.push(dots);
    }
  }
  return cells.length ? cells : null;
}

export function cellEqual(a, b) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
  return true;
}

// Does haystack (cells sequence) contain needle as a contiguous subsequence?
export function cellsContain(haystack, needle) {
  if (needle.length === 0) return true;
  if (needle.length > haystack.length) return false;
  for (let i = 0; i <= haystack.length - needle.length; i++) {
    let ok = true;
    for (let j = 0; j < needle.length; j++) {
      if (!cellEqual(haystack[i+j], needle[j])) { ok = false; break; }
    }
    if (ok) return true;
  }
  return false;
}
