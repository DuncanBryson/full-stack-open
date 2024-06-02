const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const url = process.env.MONGODB_URI;

mongoose
  .connect(url)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB", err.message);
  });

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [3, "Name must be at least 3 characters"],
    required: true,
  },
  number: {
    type: String,
    minlength: [
      8,
      "Number must be at least 8 characters and begin with 2 or 3 digits followed by a dash",
    ],
    validate: {
      validator: (v) => {
        return /^\d{2,3}-\d*$/.test(v);
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
    required: true,
  },
});

// remove _v, ensure ID is string
personSchema.set("toJSON", {
  transform: (document, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
