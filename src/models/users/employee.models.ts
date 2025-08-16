import mongoose, { Schema, Document, Types } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import bcrypt from 'bcrypt';


export interface IEm extends Document {
    _id: Types.ObjectId;
    org: Schema.Types.ObjectId;
    fullname: string;
    email: string;
    phone: string;
    picture?: string;
    password: string;
    online: boolean;
    isAuthenticated: boolean;
    isVerified: boolean;
    authorization: string[];
    disconnected: string;
    comparePassword(password: string): Promise<boolean>;
}

interface IEmModel extends mongoose.PaginateModel<IEm> {
    findByEmail(email: string): Promise<IEm>;
    // findByPhone(phone: string): Promise<IEm>;
};


const EmSchema = new Schema<IEm>({
    org: {
        type: Schema.Types.ObjectId,
        ref: 'Org',
        required: true
    },
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    picture: {
        type: String
    },
    password: {
        type: String,
        required: true
    },
    online: {
        type: Boolean,
        default: false
    },
    isAuthenticated: {
        type: Boolean,
        default: false
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    authorization: {
        type: [String],
        default: [
            'READ-ORG',
            'LIST-ORG',

            'READ-SETTINGS',

            'READ-ORDER',
            'LIST-ORDER',
            'COUNT-ORDER',

            'READ-PRODUCT',
            'LIST-PRODUCT',
            'COUNT-PRODUCT',

            'READ-RATING',
            'READ-RATING-PRODUCT',
            'LIST-RATING',
            'COUNT-RATING',

            'SAVE-ATTACHMENT',
            'DOWNLOAD-ATTACHMENT',
            'DELETE-ATTACHMENT',

            'READ-EMPLOYEE',
            'LIST-EMPLOYEE',
            'UPDATE-EMPLOYEE',
            'COUNT-EMPLOYEE',

            'READ-LEAD',
            'LIST-LEAD',
            'UPDATE-LEAD',
            'COUNT-LEAD',

            'READ-MANAGER',

            'READ-NEO',
            'LIST-NEO',
            'COUNT-NEO',

            'READ-RELANCE',
            'LIST-RELANCE',
            'DELETE-RELANCE',
            'COUNT-RELANCE',
            'UPDATE-RELANCE',
            'STOP-RELANCE',
        ]
    },
    disconnected: {
        type: String
    }
}, {
    timestamps: true
});

EmSchema.plugin(paginate);

EmSchema.pre('save', async function (next) {
    if (this.isModified('password') || this.isNew) {
        if (!this.password) {
            return next(new Error('Password is required'));
        }
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);
    }
});

EmSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
    if (!password || !this.password) {
        return false;
    }
    return await bcrypt.compare(password, this.password);
}

// Static method for finding by email
EmSchema.statics.findByEmail = async function(email: string) {
    return await this.findOne({ email: email.toLowerCase().trim() });
};


const Employee = mongoose.model<IEm, IEmModel>('Em', EmSchema);

export default Employee;
