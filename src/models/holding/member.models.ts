import mongoose, { Schema, Document, Types } from 'mongoose';
import holding from '../../db/holding.db';
import paginate from 'mongoose-paginate-v2';
import bcrypt from 'bcrypt';

export interface IMember extends Document {
    _id: Types.ObjectId;
    org: Schema.Types.ObjectId;
    firstname: string,
    lastname: string,
    email: string,
    phone: string,
    position: string;
    picture?: string;
    password: string;
    authority: boolean;
    online: boolean;
    isAuthenticated: boolean;
    staff: boolean;
    authorization: string[];
    disconnected: string;
    comparePassword(password: string): Promise<boolean>;
}

interface IMemberModel extends mongoose.PaginateModel<IMember> {};

const MemberSchema = new Schema<IMember>({
    org: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Org'
    },
    firstname: { type: String },
    lastname: { type: String },
    email: { type: String, unique: true },
    phone: { type: String },
    position: { type: String },
    picture: { type: String },
    password: { type: String },
    authority: { type: Boolean, default: false },
    online: { type: Boolean, default: false },
    isAuthenticated: { type: Boolean, default: false },
    staff: { type: Boolean, default: false },
    authorization: [String],
    disconnected: { type: String }
}, { timestamps: true });

MemberSchema.plugin(paginate);

MemberSchema.pre('save', async function (next) {
    try {
        if (this.isModified('password') || this.isNew) {
            if (this.password) {
                const salt = await bcrypt.genSalt(10);
                this.password = await bcrypt.hash(this.password, salt);
            } else {
                next(new Error('Password is required but not provided'));
            }
        }
    } catch (err: any) {
        next(err);
    }
});

MemberSchema.methods.comparePassword = async function (password: string) {
    return await bcrypt.compare(password, this.password);
}

const Member = holding.model<IMember, IMemberModel>('Member', MemberSchema);

export default Member;
