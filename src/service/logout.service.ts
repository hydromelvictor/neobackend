
const logout = async (instance: any): Promise<boolean> => {
    instance.online = false;
    instance.isAuthenticated = false;
    instance.disconnected = (new Date()).toDateString();
    await instance.save();

    return true;
}

export default logout;
