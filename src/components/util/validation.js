export function isEmpty(value) {
  return value.trim() === "";
}

export function hasMinLength(value, min) {
  return value.trim().length >= min;
}

export function isOverMaxLength(value, max) {
  
  return value.trim().length > max;
}

export function inputIsValid(value, min, max) {
  return (
    !hasMinLength(value, min) || isOverMaxLength(value, max) || isEmpty(value)
  );
}
