import mongoose, { Schema, Document, Types } from 'mongoose';
import paginate from 'mongoose-paginate-v2';


export interface IAcc extends Document {
    _id: Types.ObjectId;
    owner: Types.ObjectId;
    name?: string;
    main: boolean;
    inherit?: Types.ObjectId;
    currency: string,
    balance: number,
    privateBalance?: number,
}

interface IAccModel extends mongoose.PaginateModel<IAcc> {
    findOwner(owner: Types.ObjectId | string): Promise<IAcc>;
};

const accSchema = new Schema<IAcc>({
    owner: {
        type: Schema.Types.ObjectId,
        required: true
    },
    inherit: {
        type: Schema.Types.ObjectId,
        ref: 'Account'
    },
    name: {
        type: String,
        trim: true,
        unique: true
    },
    main: {
        type: Boolean,
        default: false,
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
    privateBalance: {
        type: Number,
        default: 0,
        min: 0
    }
}, {
    timestamps: true
});

accSchema.plugin(paginate);

accSchema.index({ owner: 1 });

accSchema.statics.findOwner = async function(owner: Types.ObjectId | string) {
    return await this.findOne({ owner: owner });
}

export default mongoose.model<IAcc, IAccModel>('Account', accSchema);
