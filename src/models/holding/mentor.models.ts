import mongoose, { Schema, Document, Types } from 'mongoose';
import holding from '../../db/holding.db';
import paginate from 'mongoose-paginate-v2';
import bcrypt from 'bcrypt';

export interface IMentor extends Document {
    _id: Types.ObjectId;
    firstname: string;
    lastname: string;
    country: string;
    city: string;
    position: string;
    phone: string;
    email: string;
    picture?: string;
    password: string;
    online: boolean;
    isAuthenticated: boolean;
    staff: boolean;
    disconnected: string;
    codecs: string;
    authorization: string[];
    referClick: number;
    comparePassword(password: string): Promise<boolean>;
}

interface IMentorModel extends mongoose.PaginateModel<IMentor> {};

const MentorSchema = new Schema<IMentor>({
    firstname: { type: String },
    lastname: { type: String },
    country: { type: String },
    city: { type: String },
    position: { type: String },
    phone: { type: String, unique: true },
    email: { type: String, unique: true, required: true },
    picture: { type: String },
    password: { type: String },
    online: { type: Boolean, default: false },
    isAuthenticated: { type: Boolean, default: false },
    staff: { type: Boolean, default: false },
    authorization: [String],
    disconnected: { type: String },
    codecs: { type: String, unique: true },
    referClick: { type: Number, default: 0},
}, { timestamps: true })

MentorSchema.plugin(paginate);

MentorSchema.pre('save', async function (next) {
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
})

MentorSchema.methods.comparePassword = async function (password: string) {
    return await bcrypt.compare(password, this.password);
}

const Mentor = holding.model<IMentor, IMentorModel>('Mentor', MentorSchema);

export default Mentor;
