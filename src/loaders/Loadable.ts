interface Loadable {
  path: string;
  alias: string;
  
  getAlias(): string;
  getPath(): string;
  
  setAlias(alias: string): Loadable;
  setPath(path: string): Loadable;
}