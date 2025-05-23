import { generateToken } from "../helpers/token.helpers";

const authenticated = async (instance: any): Promise<{ access: string, refresh: string }> => {
    instance.isAuthenticated = !instance.staff && !instance.authority ? true : false;
    instance.online = !instance.staff ? true : false;
    instance.disconnected = ''

    await instance.save();

    const access = await generateToken({ _id: instance._id }, '1d');
    if (!access) throw new Error('access token failed');

    const refresh = await generateToken({ _id: instance._id }, '7d');
    if (!refresh) throw new Error('refresh token failed');

    return { access, refresh };
}

export default authenticated;
