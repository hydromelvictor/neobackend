import { Types } from "mongoose";
import Rate, { IRate } from "../../models/market/rate.models";
import { _RsRate, _XsRate } from "../../types/market";
import axios from 'axios';


export default class Service {
    async Get(id: string | Types.ObjectId): Promise<IRate> {
        const rate = await Rate.findById(id);
        if (!rate) throw new Error('rate not found');

        return rate;
    }

    async Update(): Promise<true> {
        const { data } = await axios.get('https://api.exchangerate.host/latest?base=XOF');
        for (const [target, rate] of Object.entries(data.rates)) {
            const exchange = await Rate.findOne({ base: data.base, target });
            if (!exchange) throw new Error('rate not found');

            exchange.rate = Number(rate as any);
            await exchange.save()
        };

        return true;
    }
}
