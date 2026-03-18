import FeedbackModel from "../models/feedback-model.js";

export const submitFeedback = async (req, res, next) => {
  try {
    let { message, rating, username } = req.body;
    let newFeedback = await FeedbackModel.create({ message, rating, username });
    res.status(201).json({
      success: true,
      message: "Feedback Submitted Successfully",
      payload: newFeedback,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getFeedbacks = (req, res, next) => {};

export const getFeedback = (req, res, next) => {};

export const updateFeedback = (req, res, next) => {};

export const deleteFeedback = (req, res, next) => {};
