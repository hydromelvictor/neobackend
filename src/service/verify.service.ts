import { Types } from "mongoose";
import { removeFromBlacklist } from "../helpers/codecs.helpers";

const verify = async (code: string): Promise<string | Types.ObjectId> => {
    const instanceId = removeFromBlacklist(code);
    if (!instanceId) throw new Error('code invalid')
    return instanceId;
}

export default verify;