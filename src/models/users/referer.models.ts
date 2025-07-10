import mongoose, { Schema, Document, Types } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import bcrypt from 'bcrypt';


export interface Iref extends Document {
    _id: Types.ObjectId;
    fullname: string;
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
    promo: string;
    authorization: string[];
    click: number;
    comparePassword(password: string): Promise<boolean>;
}

interface IrefModel extends mongoose.PaginateModel<Iref> {
    findByEmail(email: string): Promise<Iref | null>;
}

const RefSchema = new Schema<Iref>({
    fullname: String,
    country: String,
    city: String,
    position: String,
    phone: {
        type: String,
        unique: true
    },
    email: {
        type: String,
        unique: true
    },
    picture: String,
    password: String,
    online: Boolean,
    isAuthenticated: Boolean,
    disconnected: String,
    promo: {
        type: String,
        unique: true
    },
    authorization: [String],
    click: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

RefSchema.plugin(paginate);

RefSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error as Error);
    }
});

RefSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
    try {
        return await bcrypt.compare(password, this.password);
    } catch (error) {
        throw error;
    }
};

RefSchema.statics.findByEmail = async function (email: string): Promise<Iref | null> {
    return await this.findOne({ email });
};

const Referer = mongoose.model<Iref, IrefModel>('Referer', RefSchema);

export default Referer;
