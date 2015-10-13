interface LoaderController {
  add(alias: string, path: string): LoaderController;
  load(cb: (loader, resources) => any): LoaderController;
}