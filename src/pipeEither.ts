import {Right, Either, ILeft, IRight, either, Left} from './either';
import {head, tail, isEmpty, } from "./array";
import {pipe} from "./pipe";

type AsyncFn<T, L, R> = (input: T) => Promise<Either<L, R>>;
const recurse = (functions: any[]) => <T>(res: T) => pipeEither(res, ...functions as [any]);

export async function pipeEither<T, R>(input: T): Promise<IRight<R>>;
export async function pipeEither<T, L, R>(input: T, f1: AsyncFn<T, L, R>): Promise<Either<L, R>>;
export async function pipeEither<T, L1, R1, L2, R2>(input: T, f1: AsyncFn<T, L1, R1>, f2: AsyncFn<R1, L2, R2>): Promise<Either<L2, R2> | ILeft<L1>>;
export async function pipeEither<T, L1, R1, L2, R2, L3, R3>(input: T, f1: AsyncFn<T, L1, R1>, f2: AsyncFn<R1, L2, R2>, f3: AsyncFn<R2, L3, R3>): Promise<Either<L3, R3> | ILeft<L1> | ILeft<L2>>;
export async function pipeEither<T, L1, R1, L2, R2, L3, R3, L4, R4>(input: T, f1: AsyncFn<T, L1, R1>, f2: AsyncFn<R1, L2, R2>, f3: AsyncFn<R2, L3, R3>, f4: AsyncFn<R3, L4, R4>): Promise<Either<L4, R4> | ILeft<L1> | ILeft<L2> | ILeft<L3>>;

export async function pipeEither(input: any, ...functions: Array<(input: unknown) => Promise<Either<unknown, unknown>>>): Promise<any> {
  return isEmpty(functions)
    ? Right(input)
    : either(
      Left,
      pipe(functions, tail, recurse),
      await head(functions)(input)
    )
}
