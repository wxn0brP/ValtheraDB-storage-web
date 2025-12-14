import { ValtheraClass } from "@wxn0brp/db-core";
import CollectionManager from "@wxn0brp/db-core/helpers/CollectionManager";
import Data from "@wxn0brp/db-core/types/data";
export * from "./storage.js";
export declare function createWebStorageValthera<T extends Record<string, Data[]>>(name: string, data?: T, storage?: Storage): ValtheraClass & {
    [K in keyof T]: CollectionManager<T[K][number]>;
};
