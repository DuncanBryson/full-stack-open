interface CalculateExercises {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

export type DailyExercises = [number];
export const exerciseCalculator = (
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

const processInputs = (args: string[]): { log: number[]; target: number } => {
  if (args.length < 4) throw new Error("Missing inputs, try again");
  const target = Number(args[2]);
  const log = args.slice(3).map((n) => {
    const number = Number(n);
    if (isNaN(number))
      throw new Error("Invalid input, training hours must be a number");
    return number;
  });
  return { log, target };
};

try {
  const { log, target } = processInputs(process.argv);
  console.log(exerciseCalculator(log, target));
} catch (error: unknown) {
  let errorMessage = "Something went wrong: ";
  if (error instanceof Error) errorMessage += error.message;
  console.error(errorMessage);
}
