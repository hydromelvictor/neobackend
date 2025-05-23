import { Authorization } from "../utils/authorize.utils";

const AUTHORIZATION = async (instance: any, actions: Array<string>): Promise<boolean> => {
    if (!actions.length) throw new Error('action error');
    
    for (const action of actions) {
        if (!Authorization.includes(action)) continue;
        const index = instance.authorization.indexOf(action);
        if (index !== -1) instance.authorization.splice(index, 1);
    else instance.authorization.push(action);
    }

    await instance.save();
    return true;
}

export default AUTHORIZATION;