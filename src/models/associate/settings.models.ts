import mongoose, { Schema, Document, Types } from 'mongoose';
import paginate from 'mongoose-paginate-v2';

interface Iset extends Document {
    _id: Types.ObjectId;
    org: Types.ObjectId;
    relance: boolean;
    status: boolean;
    lang: string;
    currency: string;
    country: string;
}

interface IsetModel extends mongoose.PaginateModel<Iset> {};

const setSchema = new Schema({
    org: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'org',
        required: true
    },
    relance: {
        type: Boolean,
        default: true
    },
    status: {
        type: Boolean,
        default: true
    },
    lang: {
        type: String,
        default: 'fr',
        lowercase: true
    },
    currency: {
        type: String,
        default: 'XOF'
    },
    country: {
        type: String,
        default: "Cote d'Ivoire"
    }
}, {
    timestamps: true
});

setSchema.plugin(paginate);

export default mongoose.model<Iset, IsetModel>('set', setSchema);
