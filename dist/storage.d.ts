import { CustomActionsBase } from "@wxn0brp/db-core/base/custom";
import { VQuery } from "@wxn0brp/db-core/types/query";
export declare class WebStorageActions extends CustomActionsBase {
    name: string;
    private storage;
    constructor(name: string, storage?: Storage);
    _getPath(collection: string): string;
    _read(collection: string): any;
    _write(collection: string, data: object[]): void;
    ensureCollection(config: VQuery): Promise<boolean>;
    issetCollection(config: VQuery): Promise<boolean>;
    getCollections(): Promise<string[]>;
    removeCollection(config: VQuery): Promise<boolean>;
}
