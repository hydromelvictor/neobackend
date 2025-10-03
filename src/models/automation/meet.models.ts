import mongoose, { Schema, Document, Types } from 'mongoose';
import paginate from 'mongoose-paginate-v2';


interface Imeet extends Document {
    _id: Types.ObjectId;
    title: string;
    assign: Types.ObjectId;
    lead: Types.ObjectId;
    moment: Date;
    current: boolean;
    room?: Types.ObjectId;
}

interface ImeetModel extends mongoose.PaginateModel<Imeet> {};

const meet = new Schema <Imeet>({
    title: {
        type: String,
        required: true
    },
    assign: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Neo'
    },
    lead: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Lead'
    },
    moment: {
        type: Date,
        required: true
    },
    current: {
        type: Boolean,
        default: true
    },
    room: {
        type: Schema.Types.ObjectId,
        ref: 'Room'
    }
}, { timestamps: true });

meet.plugin(paginate);
export default mongoose.model <Imeet, ImeetModel>('Meet', meet);
