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
    // //! this is for validation
    // if (error.name === "ValidationError") {
    //   return res.status(400).json({
    //     success: false,
    //     message: error.message,
    //   });
    // }
    // //! this is for duplicate data
    // else if (error.code === 11000) {
    //   return res.status(409).json({
    //     //? conflict
    //     success: false,
    //     message: "username already present",
    //   });
    // }
    next(error); //? passing the error to error middleware
  }
};

export const getFeedbacks = async (req, res, next) => {
  try {
    let feedbacks = await FeedbackModel.find();
    // console.log("feedbacks: ", feedbacks);

    if (feedbacks.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No feedbacks found!!",
      }); //TODO: later on we will throw an error;
    }

    res.status(200).json({
      success: true,
      message: "All feedbacks fetched successfully",
      totalNumber: feedbacks.length,
      payload: feedbacks,
    });
  } catch (error) {
    next(error);
  }
};

export const getFeedback = async (req, res, next) => {
  try {
    let { feedbackId } = req.params;
    let feedback = await FeedbackModel.findById(feedbackId);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: "feedback not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Feedback fetched successfully",
      payload: feedback,
    });
  } catch (error) {
    next(error);
  }
};
//? params -> parameters

export const updateFeedback = async (req, res, next) => {
  try {
    // console.log(req.params);
    let updatedData = await FeedbackModel.findByIdAndUpdate(
      req.params.feedbackId,
      req.body,
    );

    if (!updatedData) {
      return res.status(404).json({
        success: false,
        message: "feedback not found",
      });
    }

    res.status(200).json({
      message: "Updated Successfully",
      success: true,
      payload: updatedData,
    });
    //? findByIdAndUpdate(filter by _id, req.body, options)
  } catch (error) {
    next(error);
  }
};

export const deleteFeedback = async (req, res, next) => {
  try {
    let feedbackId = req.params.feedbackId;
    let deletedFeedback = await FeedbackModel.findByIdAndDelete(feedbackId);

    if (!deletedFeedback) {
      return res.status(404).json({
        success: false,
        message: "feedback not found",
      });
    }

    res.status(200).json({
      message: "Deleted Successfully",
      success: true,
      payload: deletedFeedback,
    });
  } catch (error) {
    next(error);
  }
};

// http://localhsot:9000/api/one/8902309umkj?key=value&key2=valuw2
//? http://localhsot:9000 -> base url
//? /api -> api version
//? /one -> endpoint
//? 8902309u -> params (req.params)
//? after ? everything comes under query params (req.query)
