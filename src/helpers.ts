import { QuillFormat } from "./quill-editor.interfaces";

export const getFormat = (
  format?: QuillFormat,
  configFormat?: QuillFormat
): QuillFormat => {
  const passedFormat = format || configFormat;
  return passedFormat || "html";
};

export function dynamicImportCommonJs<T>(
  importPromise: () => Promise<T>
): () => Promise<T> {
  // CommonJS's `module.exports` is wrapped as `default` in ESModule.
  return () => importPromise().then((m: any) => (m.default || m) as T);
}
