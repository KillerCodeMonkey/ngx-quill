import { QuillFormat } from 'itopplus-ngx-quill/config'

export const getFormat = (
  format?: QuillFormat,
  configFormat?: QuillFormat
): QuillFormat => {
  const passedFormat = format || configFormat
  return passedFormat || 'html'
}
