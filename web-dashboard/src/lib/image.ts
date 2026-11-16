export const isImageUrl = (value: string) =>
  /^https?:\/\/\S+$/i.test(value.trim());