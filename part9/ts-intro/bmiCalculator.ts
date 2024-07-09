const calculateBmi = (height: number, weight: number): string => {
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

console.log(calculateBmi(180, 74));
