// eslint-disable-next-line import/no-extraneous-dependencies
import 'selectize/index.d';

declare global {
  type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
}
