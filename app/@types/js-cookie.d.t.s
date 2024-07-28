declare module 'js-cookie' {
  interface CookiesStatic {
    get(name: string): string | undefined;
    getJSON(name: string): any;
    set(name: string, value: any, options?: any): void;
    remove(name: string, options?: any): void;
    withAttributes(attributes: any): CookiesStatic;
    withConverter(converter: any): CookiesStatic;
  }

  const Cookies: CookiesStatic;
  export default Cookies;
}