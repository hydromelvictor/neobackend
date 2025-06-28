import mongoose, { Schema, Document, Types } from 'mongoose';
import paginate from 'mongoose-paginate-v2';

export interface IRev extends Document {
    _id: Types.ObjectId;
    lead: Schema.Types.ObjectId;
    product: Schema.Types.ObjectId;
    rating: number;
    avis: string;
}

interface IReviewModel extends mongoose.PaginateModel<IRev> {};

const ReviewSchema = new Schema<IRev>({
    lead: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Lead'
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
const Review = mongoose.model<IRev, IReviewModel>('Review', ReviewSchema);

export default Review;
