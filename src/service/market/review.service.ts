import { PaginateResult } from "mongoose";
import Review, { IReview } from "../../models/market/review.models";
import { RmReview, RmReviewSchema, RsReview, RsReviewSchema, XrAccountSchema, XrReview } from "./market";



export default class ReviewService {
    async filters(q: RmReview): Promise<any> {
        const filter: any = {};

        if (q.lead) filter.lead = q.lead;
        if (q.product) filter.product = q.product;
        if (q.max) filter.rating.$lte = q.max;
        if (q.min) filter.rating.$gte = q.min;

        return filter;
    }

    async create(data: XrReview): Promise<IReview> {
        const result = XrAccountSchema.safeParse(data);
        if (!result.success) throw new Error('data invalid');
        const parsed = result.data;

        const review = new Review(parsed);
        await review.save();

        return review;
    }

    async get(data: RsReview): Promise<IReview> {
        if (!data._id) throw new Error('data invalid');
        const result = RsReviewSchema.safeParse(data);
        if (!result.data) throw new Error('data invalid');
        const parsed = result.data;

        const review = await Review.findOne(parsed);
        if (!review) throw new Error('review not found');
        return review;
    }

    async find(data: RsReview, page: number = 1, limit: number = 10): Promise<PaginateResult<IReview>> {
        const result = RmReviewSchema.safeParse(data);
        if (!result.data) throw new Error('data invalid');
        const parsed = result.data;

        const filter = await this.filters(parsed);
        const reviews = await Review.paginate(filter, { page, limit });
        return reviews;
    }

    async update(query: RsReview, data: RsReview,): Promise<IReview> {
        const review = await this.get(query);

        const result = RsReviewSchema.safeParse(data);
        if (!result.data) throw new Error('data invalid');
        const parsed = result.data;
        await review.updateOne(parsed);

        return await this.get({ _id: review._id });
    }

    async delete(data: RsReview): Promise<boolean> {
        const review = await this.get(data);
        await review.deleteOne();

        return true;
    }

    async size(data: RmReview): Promise<number> {
        const result = RmReviewSchema.safeParse(data);
        if (!result.data) throw new Error('data invalid');
        const parsed = result.data;

        const total = await Review.countDocuments(parsed);
        return total;
    }
}
