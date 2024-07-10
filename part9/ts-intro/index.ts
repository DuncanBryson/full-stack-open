import express from "express";
import { calculateBmi } from "./bmiCalculator";
import { DailyExercises, exerciseCalculator } from "./exerciseCalculator";

const app = express();
app.use(express.json());

app.get("/hello", (_req, res) => {
  res.send("Hello full stack!");
});

app.get("/bmi", (req, res) => {
  const { height, weight } = req.query;
  try {
    if (isNaN(Number(height)) || isNaN(Number(weight)))
      throw new Error("Malformatted Parameters");
    res.send({
      height,
      weight,
      bmi: calculateBmi(Number(height), Number(weight)),
    });
  } catch (error: unknown) {
    if (error instanceof Error) res.send({ error: error.message });
  }
});

app.post("/exercises", (req, res) => {
  const checkIfNumber = (item: unknown) => !isNaN(Number(item));
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { daily_exercises, target } = req.body;

    if (!daily_exercises || !target) throw new Error("Missing Parameters");
    if (
      !Array.isArray(daily_exercises) ||
      daily_exercises.every((e: unknown) => !checkIfNumber(e)) ||
      !daily_exercises.every((e) => checkIfNumber(e)) ||
      !checkIfNumber(target)
    )
      throw new Error("Malformatted Paramaters");

    const exercises = daily_exercises as DailyExercises;
    res.send(exerciseCalculator(exercises, Number(target)));
  } catch (error: unknown) {
    if (error instanceof Error) res.send({ error: error.message });
  }
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
