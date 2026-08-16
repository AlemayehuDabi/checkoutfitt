import { cleanStrings, normalizeHexColors } from './color-analysis.normalize';

describe('normalizeHexColors', () => {
  it('keeps well-formed #RRGGBB values, uppercased', () => {
    expect(normalizeHexColors(['#8c6239', '#AABBCC'], 10)).toEqual([
      '#8C6239',
      '#AABBCC',
    ]);
  });

  it('expands three-digit shorthand', () => {
    expect(normalizeHexColors(['#abc'], 10)).toEqual(['#AABBCC']);
  });

  it('trims surrounding whitespace', () => {
    expect(normalizeHexColors(['  #123456  '], 10)).toEqual(['#123456']);
  });

  it('drops colour names and malformed values', () => {
    expect(
      normalizeHexColors(
        ['navy', '#12345', '#GGGGGG', 'rgb(1,2,3)', '', '#1234567'],
        10,
      ),
    ).toEqual([]);
  });

  it('drops non-string entries', () => {
    expect(
      normalizeHexColors([1, null, undefined, {}, ['#123456']], 10),
    ).toEqual([]);
  });

  it('collapses duplicates that differ only by case or shorthand', () => {
    expect(normalizeHexColors(['#aabbcc', '#AABBCC', '#abc'], 10)).toEqual([
      '#AABBCC',
    ]);
  });

  it('caps the list at max', () => {
    const many = ['#111111', '#222222', '#333333', '#444444'];
    expect(normalizeHexColors(many, 2)).toEqual(['#111111', '#222222']);
  });

  it('returns empty for non-array input', () => {
    expect(normalizeHexColors(null, 10)).toEqual([]);
    expect(normalizeHexColors('#123456', 10)).toEqual([]);
  });
});

describe('cleanStrings', () => {
  it('keeps non-empty strings and trims them', () => {
    expect(cleanStrings([' Warm ', 'Muted'], 5)).toEqual(['Warm', 'Muted']);
  });

  it('drops blanks and non-strings', () => {
    expect(cleanStrings(['ok', '', '   ', 3, null, {}], 5)).toEqual(['ok']);
  });

  it('caps the list at max', () => {
    expect(cleanStrings(['a', 'b', 'c'], 2)).toEqual(['a', 'b']);
  });

  it('returns empty for non-array input', () => {
    expect(cleanStrings(undefined, 5)).toEqual([]);
  });
});
