//! steps to perform for every model file

//~ 1) import mongoose
//~ 2) define a structure
//~ 3) create a model/collection
//~ 4) export the model/collection

//! 1)
import mongoose from "mongoose";

//! 2) for defining structure, we use an instance/object of Schema class
let feedbackSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  username: {
    type: String,
    required: true, //? this will make sure that while saving username is there
    unique: true, //? this will make sure that while saving username is unique
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User", //? reference, this will be used while joining two or more collections
  },
});

//! 3) for creating model/collection, use model()
//& model("collection-name", schema)
const FeedbackModel = mongoose.model("Feedback", feedbackSchema);

// inside model(), the first argument we pass is the name of the collection, normally we pass the name as singular and pascal case
// mongoose will create a collection named as feedbacks (plural + lowercase)

//! 4) export
export default FeedbackModel;
