import mongoose, { Schema, Document, Types } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import bcrypt from 'bcrypt';


export interface IMan extends Document {
    _id: Types.ObjectId;
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    picture?: string;
    position: string;
    password: string;
    online: boolean;
    isAuthenticated: boolean;
    authorization: string[];
    disconnected: string;
    comparePassword(password: string): Promise<boolean>;
}

interface IManModel extends mongoose.PaginateModel<IMan> {};

const ManSchema = new Schema<IMan>({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, unique: true },
    phone: { type: String, unique: true },
    picture: { type: String },
    position: { type: String },
    password: { type: String },
    online: { type: Boolean, default: false },
    isAuthenticated: { type: Boolean, default: false },
    authorization: {
        type: [String],
        default: [
            'READ_MANAGER',
            'LIST_MANAGER',
            'UPDATE_MANAGER',
            'DELETE_MANAGER',
        ]
    },
    disconnected: { type: String }
}, { timestamps: true });

ManSchema.plugin(paginate);

ManSchema.pre('save', async function (next) {
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

ManSchema.methods.comparePassword = async function (password: string) {
    return await bcrypt.compare(password, this.password);
}

const Manager = mongoose.model<IMan, IManModel>('Manager', ManSchema);

export default Manager;