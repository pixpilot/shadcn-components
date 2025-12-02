/*
 * Polyfill for DataTransfer API for jsdom testing
 * This file contains necessary type assertions to properly
 * mock browser APIs that are not available in jsdom test environment.
 */

if (globalThis.DataTransfer === undefined) {
  class DataTransfer {
    private fileList: File[] = [];
    private items_impl = {
      add: (file: File) => {
        this.fileList.push(file);
      },
      clear: () => {
        this.fileList = [];
      },
      remove: (index: number) => {
        this.fileList.splice(index, 1);
      },
    };

    get files(): FileList {
      // Create a proper object that looks and acts like a FileList
      const handler: ProxyHandler<object> = {
        get: (target: object, prop: string | symbol) => {
          if (prop === Symbol.iterator) {
            return () => this.fileList[Symbol.iterator]();
          }
          if (prop === 'length') {
            return this.fileList.length;
          }
          if (prop === 'item') {
            return (index: number) => this.fileList[index] || null;
          }
          const index = Number.parseInt(prop as string, 10);
          if (!Number.isNaN(index)) {
            return this.fileList[index];
          }
          return (target as Record<string, unknown>)[prop as string];
        },
      };

      // Use Proxy if available, otherwise return a plain object
      if (typeof Proxy !== 'undefined') {
        return new Proxy({}, handler) as FileList;
      }

      // Fallback: create object with numeric indices
      const result: Record<string, unknown> = {
        length: this.fileList.length,
        item: (index: number) => this.fileList[index] || null,
      };
      for (let i = 0; i < this.fileList.length; i++) {
        result[i] = this.fileList[i];
      }
      return result as unknown as FileList;
    }

    get items() {
      return this.items_impl;
    }

    set items(value: typeof this.items_impl) {
      this.items_impl = value;
    }
  }

  globalThis.DataTransfer = DataTransfer as typeof globalThis.DataTransfer;
}
