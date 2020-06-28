export function setWordDayRepeat(difficulty = 'normal', mistake = false, progressCount = 0) {
  const hardMultiplier = 2;
  const normalMultiplier = 3;
  const easyMultiplier = 5;
  const today = new Date();
  const day = today.getDate();
  if (mistake) {
    return today.toJSON();
  }
  if (progressCount === '0') {
    return today.setDate(day + 1);
  }
  switch (difficulty) {
    case 'hard':
      today.setDate(day + progressCount * hardMultiplier)
      break;
    case 'normal':
      today.setDate(day + progressCount * normalMultiplier);
      break;
    case 'easy':
      today.setDate(day + progressCount * easyMultiplier);
      break;
    default:
      today.setDate(day);
  }
  return today.toJSON();
}
