import { cn } from './cn';

describe('cn (class name utility)', () => {
  it('should concatenate multiple string classes', () => {
    expect(cn('class1', 'class2', 'class3')).toBe('class1 class2 class3');
  });

  it('should filter out false values', () => {
    expect(cn('class1', false, 'class2')).toBe('class1 class2');
  });

  it('should filter out undefined values', () => {
    expect(cn('class1', undefined, 'class2')).toBe('class1 class2');
  });

  it('should filter out null values', () => {
    expect(cn('class1', null, 'class2')).toBe('class1 class2');
  });

  it('should filter out empty strings', () => {
    expect(cn('class1', '', 'class2')).toBe('class1 class2');
  });

  it('should handle conditional class names', () => {
    const isActive = true;
    const isDisabled = false;
    expect(cn('base', isActive && 'active', isDisabled && 'disabled')).toBe('base active');
  });

  it('should return empty string when no valid classes', () => {
    expect(cn(false, undefined, null, '')).toBe('');
  });

  it('should handle single class', () => {
    expect(cn('single-class')).toBe('single-class');
  });

  it('should handle no arguments', () => {
    expect(cn()).toBe('');
  });

  it('should preserve true boolean as string representation', () => {
    // Note: Boolean true is truthy but should be converted
    expect(cn('class1', true as unknown as string)).toBe('class1 true');
  });
});
