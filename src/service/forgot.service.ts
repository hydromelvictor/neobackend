import { generateCode } from "../helpers/codecs.helpers";
import gmail from "../helpers/gmail.helpers";
import { confirm } from "../helpers/html.helpers";

const forgot = async (instance: any): Promise<boolean> => {
    if (!instance) throw new Error('data invalid');

    const code = generateCode(instance._id.toString());
    await gmail(
        instance.email,
        "CODE DE REINITIALISATION DE MOT DE PASSE",
        confirm(`${instance.firstname} ${instance.lastname}`, code)
    )

    return true
}

export default forgot;
