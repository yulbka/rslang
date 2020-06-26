export function setWordNextDayRepeat(difficulty = 'normal', mistake = false, progressCount = 0) {
  const normalMultiplier = 2;
  const easyMultiplier = 5;
  const today = new Date();
  const day = today.getDate();
  if (mistake) {
    return today.toJSON();
  }
  switch (difficulty) {
    case 'normal':
      today.setDate(day + (progressCount + 1) * normalMultiplier);
      break;
    case 'easy':
      today.setDate(day + (progressCount + 1) * easyMultiplier);
      break;
    default:
      today.setDate(day);
  }
  return today.toJSON();
}
