/**
 * True for a Node filesystem error carrying an `errno` code.
 *
 * The alternative every call site reached for was `(err as
 * NodeJS.ErrnoException).code`, which asserts a shape nothing checked — a
 * thrown string or a plain object would read `undefined` and fall through
 * the wrong branch. This narrows instead, so the `code` read is sound.
 * @param error - A caught value
 * @returns Whether it is an errno-bearing Error
 */
export function isErrnoException(error: unknown): error is NodeJS.ErrnoException {
	return error instanceof Error && "code" in error;
}
