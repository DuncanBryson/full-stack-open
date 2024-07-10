import express from "express";
import { calculateBmi } from "./bmiCalculator";

const app = express();

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

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
