import { CustomActionsBase } from "@wxn0brp/db-core/base/custom";
export declare class WebStorageActions extends CustomActionsBase {
    name: string;
    private storage;
    constructor(name: string, storage?: Storage);
    _getPath(collection: string): string;
    _read(collection: string): any;
    _write(collection: string, data: object[]): void;
    ensureCollection(collection: string): Promise<boolean>;
    issetCollection(collection: string): Promise<boolean>;
    getCollections(): Promise<string[]>;
    removeCollection(collection: string): Promise<boolean>;
}
