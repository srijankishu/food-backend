import {Review} from "../models/reviewModel.js";
import FoodItem from "../models/FoodItem.js";


export const creatReview =async(req,res)=>{
    try{

     const { orderId, foodItemId, rating, comment } = req.body;
     const customerId = req.user.id;

    const existingReview = await Review.findOne({ orderId, foodItemId, customerId });
    if (existingReview) {
      return res.status(400).json({
        message: "You have already reviewed this item. Please update or delete your existing review.",
      });
    }

    const review = await Review.create({
      orderId,
      foodItemId,
      customerId,
      rating,
      comment,
    });

    const reviews = await Review.find({ foodItemId });
    const avgRating =
      reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
    await FoodItem.findByIdAndUpdate(foodItemId, { averageRating: avgRating });

     res.status(201).json({
      message: "Review submitted successfully",
      reviewId: review._id,
    });

    }catch(error){
        res.status(500).json({
            message:error.message
        });
    }
}


export const getMyReviews = async (req, res) => {
  try {
    const customerId = req.user.id;
    const reviews = await Review.find({ customerId }).populate(
      "foodItemId",
      "name"
    );

    res.status(200).json({ reviews });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const customerId = req.user.id;

    const review = await Review.findOne({ _id: id, customerId });
    if (!review)
      return res.status(404).json({ message: "Review not found or unauthorized" });

    review.rating = rating ?? review.rating;
    review.comment = comment ?? review.comment;
    await review.save();

    res.status(200).json({ message: "Review updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const customerId = req.user.id;

    const review = await Review.findOneAndDelete({ _id: id, customerId });
    if (!review)
      return res.status(404).json({ message: "Review not found or unauthorized" });

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};