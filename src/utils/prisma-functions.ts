import { Prisma } from '@prisma/client';

// ----------------------------------------------------------------

type A<T extends string> = T extends `${infer U}ScalarFieldEnum` ? U : never;
type Entity = A<keyof typeof Prisma>;
type Keys<T extends Entity> = Extract<
  keyof (typeof Prisma)[keyof Pick<typeof Prisma, `${T}ScalarFieldEnum`>],
  string
>;

/**
 * @type {function} Use to omit properties during fetching process with prisma "select"
 */
export const excludeField = <T extends Entity, K extends Keys<T>>(
  type: T,
  omit: K[]
) => {
  type Key = Exclude<Keys<T>, K>;
  type TMap = Record<Key, true>;
  const result: TMap = {} as TMap;
  for (const key in Prisma[`${type}ScalarFieldEnum`]) {
    if (!omit.includes(key as K)) {
      result[key as Key] = true;
    }
  }
  return result;
};

/**
 * @type {function}
 * Use to omit properties after fetch is completed
 */
export const excludeProperty = <T extends object, Key extends keyof T>(
  obj: T,
  keys: Key[]
) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => !keys.includes(key as Key))
  );
};
