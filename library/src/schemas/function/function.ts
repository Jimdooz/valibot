import type { BaseSchema, ErrorMessage, Input, Output, Pipe } from '../../types.ts';
import {
  executePipe,
  getDefaultArgs,
  getSchemaIssues,
} from '../../utils/index.ts';

type FunctionParameters = BaseSchema[];
type FinalFunction<
  TParameters extends FunctionParameters,
  TReturnType extends BaseSchema
  > = (...params: { [K in keyof TParameters]: Output<TParameters[K]>}) => Output<TReturnType>

/**
 * Function schema type.
 */
export type FunctionSchema<
  TParameters extends FunctionParameters,
  TReturnType extends BaseSchema
  > = BaseSchema<FinalFunction<TParameters, TReturnType>, FinalFunction<TParameters, TReturnType>> & {
  type: 'function';
};

/**
 * Creates a array schema.
 *
 * @param item The item schema.
 * @param pipe A validation and transformation pipe.
 *
 * @returns A array schema.
 */
export function Function<
  TParameters extends FunctionParameters,
  TReturnType extends BaseSchema
>(
  parameters: TParameters,
  returnType: TReturnType,
  pipe?: Pipe<FinalFunction<TParameters, TReturnType>>
): FunctionSchema<TParameters, TReturnType>;

export function Function<
  TParameters extends FunctionParameters,
  TReturnType extends BaseSchema
>(
  parameters: TParameters,
  returnType: TReturnType,
  error?: ErrorMessage,
  pipe?: Pipe<FinalFunction<TParameters, TReturnType>>
): FunctionSchema<TParameters, TReturnType>;

export function Function<
  TParameters extends FunctionParameters,
  TReturnType extends BaseSchema
>(
  arg1: TParameters,
  arg2: TReturnType,
  arg3?: ErrorMessage | Pipe<FinalFunction<TParameters, TReturnType>>,
  arg4?: Pipe<FinalFunction<TParameters, TReturnType>>
): FunctionSchema<TParameters, TReturnType> {
  // Get error and pipe argument
  const [error, pipe] = getDefaultArgs(arg3, arg4);

  // Create and return function schema
  return {
    /**
     * The schema type.
     */
    type: 'function',

    /**
     * Whether it's async.
     */
    async: false,

    /**
     * Parses unknown input based on its schema.
     *
     * @param input The input to be parsed.
     * @param info The parse info.
     *
     * @returns The parsed output.
     */
    _parse(input, info) {
      // Check type of input
      if (typeof input !== 'function') {
        return getSchemaIssues(
          info,
          'type',
          'function',
          error || 'Invalid type',
          input
        );
      }

      // Execute pipe and return result
      return executePipe(input as FinalFunction<TParameters, TReturnType>, pipe, info, 'function');
    },
  };
}
