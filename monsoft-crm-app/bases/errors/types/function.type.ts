export type SyncReturn<Output = void> =
    | {
          data: undefined;
          error: string;
      }
    | {
          data?: Output;
          error: null;
      };

export type AsyncReturn<Output> = Promise<SyncReturn<Output>>;

export type Return<Output> = SyncReturn<Output> | AsyncReturn<Output>;

export type Function<Input = void, Output = void> = (
    arg: Input,
) => Return<Output>;
