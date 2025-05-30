import { Types } from "mongoose";
import Review, { IReview } from "../../models/market/review.models";
import { _RsReview, _XsReview, RsReview, XsReview } from "../../types/market";



export default class Service {
    async Create(data: XsReview): Promise<IReview> {
        const result = _XsReview.safeParse(data);
        if (!result.success) throw new Error('data invalid');
        const parsed = result.data;

        const review = new Review(parsed);
        await review.save();

        return review;
    }

    async Get(id: string | Types.ObjectId): Promise<IReview> {
        const review = await Review.findById(id);
        if (!review) throw new Error('review not found');
        
        return review;
    }

    async Note(id: string | Types.ObjectId): Promise<number> {
        const reviews = await Review.find({ product: id });
        let note = 0;
        for (const review of reviews) note += review.rating;
        return note / reviews.length;
    }

    async Update(id: string | Types.ObjectId, data: RsReview,): Promise<IReview> {
        const review = await this.Get(id);
        const result = _RsReview.safeParse(data);
        if (!result.data) throw new Error('data invalid');
        const parsed = result.data;
        
        Object.assign(review, parsed);
        await review.save();

        return await this.Get(review._id);
    }

    async Remove(id: string | Types.ObjectId): Promise<boolean> {
        const review = await this.Get(id);
        await review.deleteOne();

        return true;
    }

    async size(id: string | Types.ObjectId): Promise<number> {
        const total = await Review.countDocuments({ product: id });
        return total;
    }
}
