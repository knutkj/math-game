declare const require: IRequire;

interface IRequire {
    <T>(path: string): T;
    context(directory, useSubdirectories?: boolean, regExp?: RegExp): IContext;
}

interface IContext {
    <T>(path: string): T;
    keys(): string[];
    id: number;
}
