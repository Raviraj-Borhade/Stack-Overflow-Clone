const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const QuestionSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "Person",
  },
  textone: {
    type: String,
    required: true,
  },
  texttwo: {
    type: String,
    required: true,
  },
  name: {
    type: String,
  },
  upvote: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "Person",
      },
    },
  ],
  answers: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "Person",
      },
      text: {
        type: String,
        required: true,
      },
      name: {
        type: String,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Question", QuestionSchema);
