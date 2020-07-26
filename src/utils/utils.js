export function toFloat(value) {
  const floatValue = parseFloat(value);

  return isNaN(floatValue) ? 0 : floatValue;
}
