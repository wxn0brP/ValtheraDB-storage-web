import { CustomActionsBase } from "@wxn0brp/db-core/base/custom";
import { DataInternal } from "@wxn0brp/db-core/types/data";
import { VQueryT } from "@wxn0brp/db-core/types/query";
export declare class WebStorageActions extends CustomActionsBase {
    name: string;
    _storage: Storage;
    version: string;
    capabilities: {
        transactions: boolean;
        indexes: boolean;
        persistent: boolean;
    };
    constructor(name: string, _storage?: Storage);
    _getPath(collection: string): string;
    _read(collection: string): any;
    _write(collection: string, data: object[]): void;
    ensureCollection(collection: string): Promise<boolean>;
    issetCollection(collection: string): Promise<boolean>;
    getCollections(): Promise<string[]>;
    removeCollection(collection: string): Promise<boolean>;
    bulkAdd(query: VQueryT.BulkAdd): Promise<DataInternal[]>;
    count(config: VQueryT.Count): Promise<number>;
}
