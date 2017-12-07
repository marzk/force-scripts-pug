declare module 'force-scripts' {
  export const getStaticFromEntry: (string) => string[];

  interface Files {
    js: string[];
    css: string[];
  }
}
