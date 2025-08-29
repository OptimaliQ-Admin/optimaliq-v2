import {
  validateEmail,
  validatePassword,
  formatCurrency,
  formatPercentage,
  formatDate,
  formatRelativeTime,
  groupBy,
  sortBy,
  uniqueBy,
  chunk,
  shuffle,
  capitalize,
  truncate,
  slugify,
  clamp,
  roundTo,
  calculatePercentage,
  pick,
  omit,
  deepClone,
  delay,
  retry,
  debounce,
  throttle,
  userSchema,
  assessmentSchema,
  AppError,
  handleError
} from '../index';

describe('Utility Functions', () => {
  describe('Validation Utilities', () => {
    test('validateEmail should validate correct emails', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name+tag@domain.co.uk')).toBe(true);
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('')).toBe(false);
    });

    test('validatePassword should validate password strength', () => {
      const strongPassword = validatePassword('StrongPass123!');
      expect(strongPassword.isValid).toBe(true);
      expect(strongPassword.errors).toHaveLength(0);

      const weakPassword = validatePassword('weak');
      expect(weakPassword.isValid).toBe(false);
      expect(weakPassword.errors.length).toBeGreaterThan(0);
    });
  });

  describe('Formatting Utilities', () => {
    test('formatCurrency should format numbers as currency', () => {
      expect(formatCurrency(1234.56)).toBe('$1,234.56');
      expect(formatCurrency(0)).toBe('$0');
      expect(formatCurrency(999999.99)).toBe('$999,999.99');
    });

    test('formatPercentage should format numbers as percentages', () => {
      expect(formatPercentage(0.75)).toBe('75.0%');
      expect(formatPercentage(0.123, 2)).toBe('12.30%');
      expect(formatPercentage(1)).toBe('100.0%');
    });

    test('formatDate should format dates correctly', () => {
      // Use a date that won't have timezone issues
      const testDate = new Date(2024, 0, 15); // January 15, 2024
      const formatted = formatDate(testDate);
      expect(formatted).toMatch(/Jan 15, 2024/);
    });

    test('formatRelativeTime should format relative time', () => {
      const now = new Date();
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
      expect(formatRelativeTime(oneHourAgo)).toBe('1 hour ago');
    });
  });

  describe('Data Manipulation Utilities', () => {
    const testArray = [
      { id: 1, name: 'Alice', age: 30 },
      { id: 2, name: 'Bob', age: 25 },
      { id: 3, name: 'Alice', age: 35 }
    ];

    test('groupBy should group array by key', () => {
      const grouped = groupBy(testArray, item => item.name);
      expect(grouped['Alice']).toHaveLength(2);
      expect(grouped['Bob']).toHaveLength(1);
    });

    test('sortBy should sort array by key', () => {
      const sorted = sortBy(testArray, item => item.age);
      expect(sorted[0]?.age).toBe(25);
      expect(sorted[2]?.age).toBe(35);
    });

    test('uniqueBy should return unique items by key', () => {
      const unique = uniqueBy(testArray, item => item.name);
      expect(unique).toHaveLength(2);
      expect(unique.map(item => item.name)).toEqual(['Alice', 'Bob']);
    });
  });

  describe('Array Utilities', () => {
    test('chunk should split array into chunks', () => {
      const array = [1, 2, 3, 4, 5, 6];
      const chunks = chunk(array, 2);
      expect(chunks).toEqual([[1, 2], [3, 4], [5, 6]]);
    });

    test('shuffle should randomize array order', () => {
      const array = [1, 2, 3, 4, 5];
      const shuffled = shuffle(array);
      expect(shuffled).toHaveLength(5);
      expect(shuffled.sort()).toEqual(array.sort());
    });
  });

  describe('String Utilities', () => {
    test('capitalize should capitalize first letter', () => {
      expect(capitalize('hello')).toBe('Hello');
      expect(capitalize('WORLD')).toBe('World');
    });

    test('truncate should truncate long strings', () => {
      expect(truncate('Hello World', 5)).toBe('He...');
      expect(truncate('Short', 10)).toBe('Short');
    });

    test('slugify should create URL-friendly slugs', () => {
      expect(slugify('Hello World!')).toBe('hello-world');
      expect(slugify('User Name & Co.')).toBe('user-name-co');
    });
  });

  describe('Number Utilities', () => {
    test('clamp should constrain values to range', () => {
      expect(clamp(5, 0, 10)).toBe(5);
      expect(clamp(-5, 0, 10)).toBe(0);
      expect(clamp(15, 0, 10)).toBe(10);
    });

    test('roundTo should round to specified decimals', () => {
      expect(roundTo(3.14159, 2)).toBe(3.14);
      expect(roundTo(3.14159, 0)).toBe(3);
    });

    test('calculatePercentage should calculate percentages', () => {
      expect(calculatePercentage(25, 100)).toBe(25);
      expect(calculatePercentage(0, 100)).toBe(0);
      expect(calculatePercentage(100, 0)).toBe(0);
    });
  });

  describe('Object Utilities', () => {
    const testObj = { a: 1, b: 2, c: 3, d: 4 };

    test('pick should select specified keys', () => {
      const picked = pick(testObj, ['a', 'c']);
      expect(picked).toEqual({ a: 1, c: 3 });
    });

    test('omit should exclude specified keys', () => {
      const omitted = omit(testObj, ['b', 'd']);
      expect(omitted).toEqual({ a: 1, c: 3 });
    });

    test('deepClone should create deep copies', () => {
      const original = { a: { b: { c: 1 } } };
      const cloned = deepClone(original);
      cloned.a.b.c = 2;
      expect(original.a.b.c).toBe(1);
      expect(cloned.a.b.c).toBe(2);
    });
  });

  describe('Async Utilities', () => {
    test('delay should wait specified time', async () => {
      const start = Date.now();
      await delay(100);
      const end = Date.now();
      expect(end - start).toBeGreaterThanOrEqual(95);
    });

    test('retry should retry failed operations', async () => {
      let attempts = 0;
      const failingFn = async (): Promise<string> => {
        attempts++;
        if (attempts < 3) throw new Error('Failed');
        return 'Success';
      };

      const result = await retry(failingFn, 3);
      expect(result).toBe('Success');
      expect(attempts).toBe(3);
    });
  });

  describe('Performance Utilities', () => {
    test('debounce should delay function execution', (done) => {
      let callCount = 0;
      const debouncedFn = debounce(() => {
        callCount++;
        expect(callCount).toBe(1);
        done();
      }, 100);

      debouncedFn();
      debouncedFn();
      debouncedFn();
    });

    test('throttle should limit function execution rate', () => {
      let callCount = 0;
      const throttledFn = throttle(() => {
        callCount++;
      }, 100);

      // Call multiple times rapidly
      throttledFn();
      throttledFn();
      throttledFn();
      throttledFn();
      throttledFn();

      // Should only execute once due to throttling
      expect(callCount).toBe(1);
    });
  });

  describe('Validation Schemas', () => {
    test('userSchema should validate valid user data', () => {
      const validUser = {
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        agreedTerms: true,
        agreedMarketing: false
      };

      const result = userSchema.safeParse(validUser);
      expect(result.success).toBe(true);
    });

    test('userSchema should reject invalid user data', () => {
      const invalidUser = {
        email: 'invalid-email',
        firstName: '',
        lastName: '',
        agreedTerms: false,
        agreedMarketing: false
      };

      const result = userSchema.safeParse(invalidUser);
      expect(result.success).toBe(false);
    });

    test('assessmentSchema should validate valid assessment data', () => {
      const validAssessment = {
        type: 'onboarding',
        payload: { question1: 'answer1' },
        userId: '123e4567-e89b-12d3-a456-426614174000'
      };

      const result = assessmentSchema.safeParse(validAssessment);
      expect(result.success).toBe(true);
    });
  });

  describe('Error Handling', () => {
    test('AppError should create custom errors', () => {
      const error = new AppError('Test error', 'TEST_ERROR', 400, { detail: 'test' });
      expect(error.message).toBe('Test error');
      expect(error.code).toBe('TEST_ERROR');
      expect(error.statusCode).toBe(400);
      expect(error.details).toEqual({ detail: 'test' });
    });

    test('handleError should wrap unknown errors', () => {
      const unknownError = 'Unknown error';
      const wrappedError = handleError(unknownError);
      expect(wrappedError).toBeInstanceOf(AppError);
      expect(wrappedError.code).toBe('UNKNOWN_ERROR');
    });
  });
});
