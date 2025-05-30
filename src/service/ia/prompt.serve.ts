import { PaginateResult, Types } from "mongoose";
import Prompt, { IPrompt } from "../../models/ia/prompt.models"
import { _RsPrompt, _XsPrompt, RsPrompt, XsPrompt } from "../../types/ia"



export default class Service {
    async create(data: XsPrompt): Promise<IPrompt> {
        const result = _XsPrompt.safeParse(data);
        if (!result.success) throw new Error('invalid data');
        const parsed = result.data;

        const prompt = new Prompt(parsed);
        await prompt.save();

        return prompt;
    }

    async Get(id: string | Types.ObjectId): Promise<IPrompt> {
        const prompt = await Prompt.findById(id);
        if (!prompt) throw new Error('prompt not found');

        return prompt;
    }

    async Find(data: RsPrompt, options: any): Promise<PaginateResult<IPrompt>> {
        const prompts = await Prompt.paginate(data, options);
        return prompts;
    }

    async Update(id: string | Types.ObjectId, data: RsPrompt): Promise<IPrompt> {
        const prompt = await this.Get(id);
        const result = _RsPrompt.safeParse(data);
        if (!result.success) throw new Error('invalid data');
        const parsed = result.data;

        Object.assign(prompt, parsed);
        await prompt.save();

        return prompt;
    }

    async Remove(id: string | Types.ObjectId): Promise<boolean> {
        const prompt = await this.Get(id);
        prompt.deleteOne();

        return true;
    }

    async Size(data: RsPrompt): Promise<number> {
        const total = await Prompt.countDocuments(data);
        return total;
    }
}