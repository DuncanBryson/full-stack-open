export const calculateBmi = (height: number, weight: number): string => {
  const bmi = weight / (height / 100) ** 2;
  if (bmi < 16) return "Underweight (severe)";
  if (16 <= bmi && bmi < 17) return "Underweight (moderate)";
  if (17 <= bmi && bmi < 18.5) return "Underweight (mild)";
  if (18.5 <= bmi && bmi < 25) return "Normal (Healthy weight)";
  if (25 <= bmi && bmi < 30) return "Overweight (Pre-obese)";
  if (30 <= bmi && bmi < 35) return "Obese (Class I)";
  if (35 <= bmi && bmi < 40) return "Obese (Class II)";
  if (bmi >= 40) return "Obese (Class III)";
  return "normal";
};

const inputHandler = (args: string[]): { height: number; weight: number } => {
  if (args.length < 4) throw new Error("Missing inputs, try again");
  if (args.length > 4) throw new Error("Too many inputs, try again");
  const height = Number(args[2]);
  const weight = Number(args[3]);
  if (isNaN(height) || isNaN(weight))
    throw new Error("Invalid inputs, must enter numbers for height and weight");
  return { height, weight };
};
try {
  const { height, weight } = inputHandler(process.argv);
  console.log(calculateBmi(height, weight));
} catch (error: unknown) {
  let errorMessage = "Something went wrong: ";
  if (error instanceof Error) errorMessage += error.message;
  console.error(errorMessage);
}
