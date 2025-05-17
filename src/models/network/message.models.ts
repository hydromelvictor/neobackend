import dotenv from 'dotenv';
dotenv.config()

import mongoose, { Schema, Document, Types } from 'mongoose';
import paginate from 'mongoose-paginate-v2';
import network from '../../db/network.db';
import crypto from 'crypto';

const algorithm = 'aes-256-cbc'; // Algorithme de chiffrement
const key = Buffer.from(`${process.env.ENCRYPTION_KEY}`, 'hex'); // Clé de 32 octets (256 bits)
const iv = Buffer.from(`${process.env.ENCRYPTION_IV}`, 'hex'); // IV de 16 octets (128 bits)

const encrypt = (text: string) => {
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;

};


const decrypt = (encryptedText: string) => {
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
};

export interface ISms extends Document {
    discussion: Types.ObjectId;
    hote: Types.ObjectId;
    content: string;
    state: 'text' | 'image' | 'video' | 'audio' | 'file' | 'sticker';
    read: boolean;
}

interface ISmsModel extends mongoose.PaginateModel<ISms> {};

const SmSchema = new Schema<ISms>({
    discussion: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Discussion'
    },
    hote: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    content: String,
    state: {
        type: String,
        enum: ['text', 'image', 'video', 'audio', 'file'],
        default: 'text'
    },
    read: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });
SmSchema.plugin(paginate);

SmSchema.pre('save', function (next) {
    if (this.isModified('content') || this.isNew) {
        this.content = encrypt(this.content);
    }
    next();
});

SmSchema.post('init', function (this: Document & { content: string }) {
  if (this.content) {
    this.content = decrypt(this.content);
  }
});

const Sms = network.model<ISms, ISmsModel>('Sms', SmSchema);
export default Sms;