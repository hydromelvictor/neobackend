import { Types } from "mongoose";
import Member from "../models/holding/member.models";
import Mentor from '../models/holding/mentor.models';
import Admin from '../models/holding/admin.models';

const reset = async (password: string, id: string | Types.ObjectId): Promise<boolean> => {
    const instance = await Member.findById(id) || await Mentor.findById(id) || await Admin.findById(id);
    if (!instance) throw new Error('not found');
    
    instance.password = password;
    instance.online = false;
    instance.isAuthenticated = false;
    instance.disconnected = (new Date()).toDateString()
    await instance.save();
    return true;
}

export default reset;
