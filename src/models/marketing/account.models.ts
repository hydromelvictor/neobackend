import mongoose, { Schema, Document, Types } from 'mongoose';
import paginate from 'mongoose-paginate-v2';


type Assign = {
    org: Types.ObjectId;
    balance: number;
}

export interface IAcc extends Document {
    _id: Types.ObjectId;
    owner: Types.ObjectId;
    currency: string,
    balance: number,
    assign: Assign[]
}

interface IAccModel extends mongoose.PaginateModel<IAcc> {
    findOwner(owner: Types.ObjectId | string): Promise<IAcc>;
};

const accSchema = new Schema<IAcc>({
    owner: {
        type: Schema.Types.ObjectId,
        required: true
    },
    currency: {
        type: String,
        default: 'XOF',
        required: true
    },
    balance: {
        type: Number,
        default: 0,
        min: 0,
        required: true
    },
    assign: [{
        org: {
            type: Schema.Types.ObjectId,
            ref: 'Org',
            required: true
        },
        balance: {
            type: Number,
            default: 0,
            min: 0
        }
    }]
}, {
    timestamps: true
});

accSchema.plugin(paginate);

accSchema.index({ owner: 1 });

accSchema.statics.findOwner = async function(owner: Types.ObjectId | string) {
    return await this.findOne({ owner: owner });
}

export default mongoose.model<IAcc, IAccModel>('Account', accSchema);
