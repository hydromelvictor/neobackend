
const reset = async (password: string, instance: any): Promise<boolean> => {
    instance.password = password;
    instance.online = false;
    instance.isAuthenticated = false;
    await instance.save();
    return true;
}

export default reset;
