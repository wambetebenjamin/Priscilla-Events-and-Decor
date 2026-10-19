/**
 * Kept in its own file so lib/quiz.ts can import it without a cycle when other
 * modules only need the package id union.
 */
export type PackageId = 'essential' | 'bloom' | 'grand';
