import type { BaseSchemaAsync, ErrorMessage } from '../../types.ts';
import { getSchemaIssues, getOutput } from '../../utils/index.ts';

/**
 * Null schema async type.
 */
export type NullSchemaAsync<TOutput = null> = BaseSchemaAsync<null, TOutput> & {
  type: 'null';
};

/**
 * Creates an async null schema.
 *
 * @param error The error message.
 *
 * @returns An async null schema.
 */
export function nullAsync(error?: ErrorMessage): NullSchemaAsync {
  return {
    /**
     * The schema type.
     */
    type: 'null',

    /**
     * Whether it's async.
     */
    async: true,

    /**
     * Parses unknown input based on its schema.
     *
     * @param input The input to be parsed.
     * @param info The parse info.
     *
     * @returns The parsed output.
     */
    async _parse(input, info) {
      // Check type of input
      if (input !== null) {
        return getSchemaIssues(
          info,
          'type',
          'null',
          error || 'Invalid type',
          input
        );
      }

      // Return input as output
      return getOutput(input);
    },
  };
}

/**
 * See {@link nullAsync}
 *
 * @deprecated Use `nullAsync` instead.
 */
export const nullTypeAsync = nullAsync;
