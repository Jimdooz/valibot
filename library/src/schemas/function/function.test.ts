import { describe, expect, test } from 'vitest';
import { parse } from '../../methods/index.ts';
import { toCustom } from '../../transformations/index.ts';
import { Function } from './function.ts';

import { any } from '../any/any.ts';
import { string } from '../string/string.ts';
import { number } from '../number/number.ts';
import { boolean } from '../boolean/boolean.ts';
import { Output } from '../../types.ts';
import { literal } from '../literal/literal.ts';

describe('function', () => {
  test('should pass only functions', () => {
    const schema1 = Function([], any());
    const input1 = () => {};
    const output1 = parse(schema1, input1);
    expect(output1).toBe(input1);

    const schema2 = Function([string(), number()], boolean());
    const input2 = (hello: string, world: number) => { return true; };
    const output2 = parse(schema2, input2);
    expect(output2).toBe(input2);

    const output3 = parse(schema2, input1);
    expect(output3).toBe(input1);

    expect(() => parse(schema1, {})).toThrowError();
    expect(() => parse(schema1, 123)).toThrowError();
    expect(() => parse(schema1, '() => true')).toThrowError();

    expect(() => parse(schema2, {})).toThrowError();
    expect(() => parse(schema2, 123)).toThrowError();
    expect(() => parse(schema2, '() => true')).toThrowError();
  });

  test('should throw custom error', () => {
    const error = 'Value is not an array!';
    const schema = Function([number()], number(), error);
    expect(() => parse(schema, 123)).toThrowError(error);
  });

  test('should execute pipe', () => {
    const customFunction = () => false;
    const transformInput = () => customFunction;
    const output1 = parse(Function([], boolean(), [toCustom(transformInput)]), () => true);
    expect(output1).toBe(transformInput());
    const output2 = parse(Function([], boolean(), 'Error', [toCustom(transformInput)]), () => true);
    expect(output2).toBe(transformInput());
  });
});
