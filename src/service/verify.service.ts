import { removeFromBlacklist } from "../helpers/codecs.helpers";

const verify = async (code: string): Promise<string> => {
    if (!code) throw new Error('code invalid') ;

    const username = removeFromBlacklist(code);
    if (!username) throw new Error('code invalid');
    return username;
}

export default verify;
