import mongoose, { Schema, Document, Types } from 'mongoose';
import market from '../../db/market.db';
import paginate from 'mongoose-paginate-v2';

export interface IReview extends Document {
    _id: Types.ObjectId;
    lead: Schema.Types.ObjectId;
    product: Schema.Types.ObjectId;
    rating: number;
    avis: string;
}

interface IReviewModel extends mongoose.PaginateModel<IReview> {};

const ReviewSchema = new Schema<IReview>({
    lead: {
        type: Schema.Types.ObjectId,
        required: true
    },
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    avis: String
}, { timestamps: true })

ReviewSchema.plugin(paginate);
const Review = market.model<IReview, IReviewModel>('Review', ReviewSchema);

export default Review;
