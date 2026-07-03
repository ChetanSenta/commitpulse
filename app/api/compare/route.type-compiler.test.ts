import { describe, it, expectTypeOf } from 'vitest';
import type { CompareParams } from '@/lib/validations';

describe('Compare API Type Compiler Validation', () => {
  // ─────────────────────────────────────────────────────────────
  // 1. Valid type inference
  // ─────────────────────────────────────────────────────────────
  it('infers CompareParams correctly from schema', () => {
    expectTypeOf<CompareParams>().toHaveProperty('user1');
    expectTypeOf<CompareParams>().toHaveProperty('user2');

    expectTypeOf<CompareParams['user1']>().toBeString();
    expectTypeOf<CompareParams['user2']>().toBeString();
  });

  // ─────────────────────────────────────────────────────────────
  // 2. Valid optional properties (if extended later)
  // ─────────────────────────────────────────────────────────────
  it('allows base valid structure for compare params', () => {
    const valid: CompareParams = {
      user1: 'octocat',
      user2: 'torvalds',
    };

    expectTypeOf(valid.user1).toEqualTypeOf<string>();
    expectTypeOf(valid.user2).toEqualTypeOf<string>();
  });

  // ─────────────────────────────────────────────────────────────
  // 3. Prevent identical user comparison (type-level intent check)
  // ─────────────────────────────────────────────────────────────
  it('ensures different user fields exist in structure', () => {
    expectTypeOf<CompareParams['user1']>().not.toBeNever();
    expectTypeOf<CompareParams['user2']>().not.toBeNever();
  });

  // ─────────────────────────────────────────────────────────────
  // 4. Reject invalid structural types (compile-time safety)
  // ─────────────────────────────────────────────────────────────
  it('user1 must be string', () => {
    expectTypeOf<CompareParams['user1']>().toEqualTypeOf<string>();
  });

  // ─────────────────────────────────────────────────────────────
  // 5. Ensures schema output matches inferred type stability
  // ─────────────────────────────────────────────────────────────
  it('maintains schema-to-type consistency', () => {
    type Keys = keyof CompareParams;

    expectTypeOf<Keys>().toEqualTypeOf<'user1' | 'user2'>();
  });
});
