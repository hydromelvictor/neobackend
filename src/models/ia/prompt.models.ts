import mongoose, { Schema, Document, Types } from 'mongoose';
import paginate from 'mongoose-paginate-v2';

export interface IPrompt extends Document {
    _id: Types.ObjectId;
    ia: Types.ObjectId;
    subject: string;
    text: string;
}

interface IPrompTModel extends mongoose.PaginateModel<IPrompt> {};

const PromptSchema = new Schema<IPrompt>({
    ia: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ia',
        required: true
    },
    subject: String,
    text: String
}, { timestamps: true });
PromptSchema.plugin(paginate);
const Prompt = mongoose.model<IPrompt, IPrompTModel>('Prompt', PromptSchema);
export default Prompt;