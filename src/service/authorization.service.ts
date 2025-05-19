import { Authorization } from "../utils/authorize.utils";

const ToggleAuthorize = async (instance: any, action: string): Promise<boolean> => {
    if (!action || !(action in Authorization)) throw new Error('action error');
    
    const index = instance.authorization.indexOf(action);
    if (index !== -1) instance.authorization.splice(index, 1);
    else instance.authorization.push(action);

    await instance.save();
    return instance;
}

export default ToggleAuthorize;