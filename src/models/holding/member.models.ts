import mongoose, { Schema, Document, Types } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import bcrypt from 'bcrypt';

export interface IMember extends Document {
    _id: Types.ObjectId;
    org: Schema.Types.ObjectId;
    fullname: string;
    email: string;
    phone: string;
    position: string;
    picture?: string;
    password: string;
    online: boolean;
    isAuthenticated: boolean;
    authorization: string[];
    disconnected: string;
    comparePassword(password: string): Promise<boolean>;
}

interface IMemberModel extends mongoose.PaginateModel<IMember> {};

const MemberSchema = new Schema<IMember>({
    org: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Org',
        required: true
    },
    fullname: { type: String },
    email: { type: String, unique: true },
    phone: { type: String },
    position: { type: String },
    picture: { type: String },
    password: { type: String },
    online: { type: Boolean, default: false },
    isAuthenticated: { type: Boolean, default: false },
    authorization: [
        'READ_MEMBER',
        'LIST_MEMBER',
        'UPDATE_MEMBER',
        
        'READ_ORG',
        'LIST_ORG',
        
        'READ_AGENT',
        'LIST_AGENT',

        'READ_PROMPT',
        'LIST_PROMPT',

        'READ_ORDER',
        'LIST_ORDER',

        'READ_PRODUCT',
        'LIST_PRODUCT',

        'CREATE_RATE',
        'READ_RATE',
        'LIST_RATE',

        'CREATE_REVIEW',
        'READ_REVIEW',
        'LIST_REVIEW',
        'UPDATE_REVIEW',
        'DELETE_REVIEW',

        'CREATE_TRANSACTION',
        'READ_TRANSACTION',
        'LIST_TRANSACTION',
        'UPDATE_TRANSACTION',
        'DELETE_TRANSACTION',

        'CREATE_ATTACHMENT',
        'READ_ATTACHMENT',
        'LIST_ATTACHMENT',
        'UPDATE_ATTACHMENT',
        'DELETE_ATTACHMENT',

        'CREATE_DISCUSSION',
        'READ_DISCUSSION',
        'LIST_DISCUSSION',
        'UPDATE_DISCUSSION',
        'DELETE_DISCUSSION',

        'CREATE_GUEST',
        'READ_GUEST',
        'LIST_GUEST',
        'UPDATE_GUEST',
        'DELETE_GUEST',

        'CREATE_MEET',
        'READ_MEET',
        'LIST_MEET',
        'UPDATE_MEET',
        'DELETE_MEET',

        'CREATE_MESSAGE',
        'READ_MESSAGE',
        'LIST_MESSAGE',
        'UPDATE_MESSAGE',
        'DELETE_MESSAGE',

        'CREATE_REACTION',
        'READ_REACTION',
        'LIST_REACTION',
        'UPDATE_REACTION',
        'DELETE_REACTION',

        'CREATE_STATUS',
        'READ_STATUS',
        'LIST_STATUS',

        'CREATE_VIEW',
        'READ_VIEW',
        'LIST_VIEW',

        'READ_ANNONCE',
        'LIST_ANNONCE',
    ],
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

const Member = mongoose.model<IMember, IMemberModel>('Member', MemberSchema);

export default Member;
