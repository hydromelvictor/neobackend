import mongoose, { Schema, Document, Types } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import bcrypt from 'bcrypt';

export interface IManager extends Document {
    _id: Types.ObjectId;
    firstname: string;
    lastname: string;
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

interface IManageModel extends mongoose.PaginateModel<IManager> {};

const ManagerSchema = new Schema<IManager> ({
    firstname: { type: String },
    lastname: { type: String },
    email: { type: String, unique: true },
    phone: { type: String },
    position: { type: String },
    picture: { type: String },
    password: { type: String },
    online: { type: Boolean, default: false },
    isAuthenticated: { type: Boolean, default: false },
    authorization: [
        
    ],
    disconnected: { type: String }
}, { timestamps: true });

ManagerSchema.plugin(paginate);

ManagerSchema.pre('save', async function (next) {
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

ManagerSchema.methods.comparePassword = async function (password: string) {
    return await bcrypt.compare(password, this.password);
}

const Manager = mongoose.model<IManager, IManageModel>('Manaer', ManagerSchema);

export default Manager;