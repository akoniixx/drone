export function containsEmoji(str: string) {
  const emojiRange = /[\uD800-\uDBFF][\uDC00-\uDFFF]/;
  return emojiRange.test(str);
}
export function containsSpecialCharacter(str: string) {
  const specialCharacterRangeAndSpace =
    /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/? ]/;
  return specialCharacterRangeAndSpace.test(str);
}

export function mixValidator(str: string) {
  if (containsEmoji(str)) {
    return str.slice(0, -2);
  }
  if (containsSpecialCharacter(str)) {
    return str.slice(0, -1);
  }
  return str;
}
export const validatorDecimal = (str: string) => {
  const decimalTwo = /^(\d+)?([.]?\d{0,2})?$/;

  if (containsEmoji(str)) {
    return str.slice(0, -2);
  }

  if (decimalTwo.test(str)) {
    return str;
  }
  return str.slice(0, -1);
};
