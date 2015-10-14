interface ILoadable {
  path: string;
  alias: string;
  
  getAlias(): string;
  getPath(): string;
  
  setAlias(alias: string): ILoadable;
  setPath(path: string): ILoadable;
}