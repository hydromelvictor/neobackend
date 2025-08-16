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
    disconnected?: string;
    comparePassword(password: string): Promise<boolean>;
}

interface IManModel extends mongoose.PaginateModel<IMan> {
    findByEmail(email: string): Promise<IMan>;
    findByPhone(phone: string): Promise<IMan>;
};


const ManSchema = new Schema<IMan>({
    firstname: { 
        type: String, 
        required: [true, 'First name is required'],
        trim: true,
        minlength: [3, 'First name must be at least 3 characters'],
        maxlength: [20, 'First name cannot exceed 20 characters']
    },
    lastname: { 
        type: String, 
        required: [true, 'Last name is required'],
        trim: true,
        minlength: [3, 'Last name must be at least 3 characters'],
        maxlength: [20, 'Last name cannot exceed 20 characters']
    },
    email: { 
        type: String, 
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
    },
    phone: { 
        type: String, 
        required: [true, 'Phone number is required'],
        unique: true,
        trim: true,
        minlength: [10, 'Phone number must be at least 10 characters'],
        maxlength: [15, 'Phone number cannot exceed 15 characters']
    },
    picture: { 
        type: String,
        trim: true
    },
    position: { 
        type: String,
        required: [true, 'Position is required'],
        trim: true,
        minlength: [3, 'Position must be at least 3 characters'],
        maxlength: [20, 'Position cannot exceed 20 characters']
    },
    password: { 
        type: String,
        required: [true, 'Password is required']
    },
    online: { 
        type: Boolean, 
        default: false 
    },
    isAuthenticated: {
        type: Boolean, 
        default: false 
    },
    authorization: {
        type: [String],
        default: [
            'READ-ORG',
            'LIST-ORG',
            'UPDATE-ORG',
            'DELETE-ORG',
            'COUNT-ORG',

            'READ-SETTINGS',
            'LIST-SETTINGS',
            'UPDATE-SETTINGS',

            'CREATE-STATUS',

            'READ-ACCOUNT',
            'LIST-ACCOUNT',
            'ASSIGN-ACCOUNT',
            'ACTES-ACCOUNT',

            'READ-TRACKING',
            'LIST-TRACKING',

            'READ-ORDER',
            'LIST-ORDER',
            'COUNT-ORDER',

            'CREATE-PRODUCT',
            'READ-PRODUCT',
            'LIST-PRODUCT',
            'UPDATE-PRODUCT',
            'DELETE-PRODUCT',
            'COUNT-PRODUCT',

            'READ-RATING',
            'READ-RATING-PRODUCT',
            'LIST-RATING',
            'COUNT-RATING',

            'SAVE-ATTACHMENT',
            'DOWNLOAD-ATTACHMENT',
            'DELETE-ATTACHMENT',

            'READ-EMPLOYEE',
            'UPDATE-EMPLOYEE',
            'LIST-EMPLOYEE',
            'DELETE-EMPLOYEE',
            'COUNT-EMPLOYEE',

            'READ-LEAD',
            'LIST-LEAD',
            'UPDATE-LEAD',
            'COUNT-LEAD',

            'READ-MANAGER',
            'UPDATE-MANAGER',
            'DELETE-MANAGER',

            'SAVE-NEO',
            'READ-NEO',
            'LIST-NEO',
            'UPDATE-NEO',
            'DELETE-NEO',
            'COUNT-NEO',

            'READ-REFERER',

            'READ-RELANCE',
            'LIST-RELANCE',
            'DELETE-RELANCE',
            'COUNT-RELANCE',
            'UPDATE-RELANCE',
            'STOP-RELANCE',
        ],
        validate: {
            validator: function(arr: string[]) {
                return arr.length > 0;
            },
            message: 'At least one authorization is required'
        }
    },
    disconnected: { 
        type: String,
        trim: true
    }
}, { 
    timestamps: true,
    toJSON: { 
        transform: function(doc, ret) {
            delete ret.password;
            return ret;
        }
    }
});

ManSchema.plugin(paginate);

// Improved pre-save hook
ManSchema.pre('save', async function (next) {
    try {
        // Hash password only if it's modified or new
        if (this.isModified('password') || this.isNew) {
            if (!this.password) {
                return next(new Error('Password is required'));
            }
            const salt = await bcrypt.genSalt(12);
            this.password = await bcrypt.hash(this.password, salt);
        }

        next();
    } catch (err: any) {
        next(err);
    }
});

// Instance method for password comparison
ManSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
    if (!password || !this.password) {
        return false;
    }
    return await bcrypt.compare(password, this.password);
};

// Static method for finding by email
ManSchema.statics.findByEmail = function(email: string) {
    return this.findOne({ email: email.toLowerCase().trim() });
};

// Static method for finding by phone
ManSchema.statics.findByPhone = function(phone: string) {
    return this.findOne({ phone: phone.trim() });
};

// Virtual for full name
ManSchema.virtual('fullName').get(function() {
    return `${this.firstname} ${this.lastname}`;
});

const Manager = mongoose.model<IMan, IManModel>('Manager', ManSchema);

export { Manager as default };
