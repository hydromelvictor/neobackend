import mongoose, { Schema, Document, Types } from 'mongoose';
import paginate from 'mongoose-paginate-v2';

interface BlacklistEntry {
  code: string;
  token: string;
  createdAt: Date;
  expiresAt: Date;
  attempts: number;
  maxAttempts: number;
}

export interface IList extends Document {
    name: string;
    data: Types.Array<BlacklistEntry | any>;
}

interface IListModel extends mongoose.PaginateModel<IList> {
    findByName(name: string): Promise<IList | null>;
};

const ListSchema = new Schema<IList>({
    name: {
        type: String,
        required: true,
        unique: true
    },
    data: [mongoose.Schema.Types.Mixed]
}, { timestamps: true });

ListSchema.plugin(paginate);
ListSchema.statics.findByName = async function (name: string): Promise<IList | null> {
    return this.findOne({ name });
};

const List = mongoose.model<IList, IListModel>('List', ListSchema);
export default List;