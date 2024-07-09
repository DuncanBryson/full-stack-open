interface CalculateExercises {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}
const exerciseCalculator = (
  args: number[],
  target: number
): CalculateExercises => {
  const periodLength = args.length;
  const trainingDays = args.filter((n) => n > 0).length;
  const average = args.reduce((average, n) => average + n, 0) / periodLength;
  let rating;
  if (average / target < 0.5) rating = 1;
  else if (average / target < 1) rating = 2;
  else rating = 3;
  const descriptions = [
    "Less than half your target!",
    "Good, but could be better",
    "Great",
  ];
  const ratingDescription = descriptions[rating - 1];

  return {
    periodLength,
    trainingDays,
    success: average >= rating,
    rating,
    ratingDescription,
    target,
    average,
  };
};
console.log(exerciseCalculator([3, 0, 2, 4.5, 0, 3, 1], 2));
