export function getRandomNumber(maxNumber, minNumber = 0) {
  return Math.round(minNumber - 0.5 + Math.random() * (maxNumber - minNumber + 1));
}
