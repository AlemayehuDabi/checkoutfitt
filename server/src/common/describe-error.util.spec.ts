import { describeError } from './describe-error.util';

describe('describeError', () => {
  it('renders an Error with its name and message', () => {
    expect(describeError(new TypeError('bad input'))).toBe(
      'TypeError: bad input',
    );
  });

  it('includes a driver error code', () => {
    const error = Object.assign(new Error('connection lost'), {
      code: 'ETIMEDOUT',
    });
    expect(describeError(error)).toBe('Error (ETIMEDOUT): connection lost');
  });

  it('says so when an Error carries no message', () => {
    expect(describeError(new Error(''))).toBe('Error: <no message>');
  });

  it('reads a plain rejection object rather than printing [object Object]', () => {
    expect(describeError({ message: 'Unknown API key', http_code: 401 })).toBe(
      'Unknown API key (HTTP 401)',
    );
  });

  it('reads a nested error message', () => {
    expect(describeError({ error: { message: 'quota exceeded' } })).toBe(
      'quota exceeded',
    );
  });

  it('falls back to JSON for objects with no message', () => {
    expect(describeError({ status: 500 })).toBe('{"status":500}');
  });

  it('handles primitives', () => {
    expect(describeError('plain string')).toBe('plain string');
    expect(describeError(null)).toBe('null');
  });
});
