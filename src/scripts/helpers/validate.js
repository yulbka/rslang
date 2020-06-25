export function validatePassword(password) {
  const regExp = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[+\-_@$!%*?&#.,;:[\]{}]).{8,}/;
  return regExp.test(password);
}

export function validateEmail(email) {
  const regExp = /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/;
  return regExp.test(email);
}
