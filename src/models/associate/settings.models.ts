import mongoose, { Schema, Document, Types } from 'mongoose';
import paginate from 'mongoose-paginate-v2';

interface Iset extends Document {
    _id: Types.ObjectId;
    org: Types.ObjectId;
    autoRelance: boolean;