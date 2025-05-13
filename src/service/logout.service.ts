
const logout = async (instance: any): Promise<boolean> => {
    instance.online = false;
    instance.isAuthenticated = false;
    await instance.save();

    return true;
}

export default logout;
