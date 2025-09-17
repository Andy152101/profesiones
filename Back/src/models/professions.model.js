import mongoose from "mongoose";

const professionsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  linked_skills: [
    {
      test_field: {
        type: String,
        required: true,
      },
    },
  ],
});

export default mongoose.model("Professions", professionsSchema);
