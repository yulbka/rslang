export function findLongestSeries(array, answer) {
  let maxTimes = 0;
  let currentTimes = 0;
  array.forEach(letter => {
    if (letter === answer) {
      currentTimes += 1;
    } else if (currentTimes > maxTimes) {
        maxTimes = currentTimes;
        currentTimes = 0;
      }
  });
  return Math.max(currentTimes, maxTimes);
}