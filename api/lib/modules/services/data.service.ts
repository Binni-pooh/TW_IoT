import DataModel from '../schemas/data.schema';
import {IData} from "../models/data.model";
import {config} from '../../config';

export default class DataService {

    public async createData(dataParams: IData) {
        try {
            const dataModel = new DataModel(dataParams);
            await dataModel.save();
        } catch (error) {
            console.error('Wystąpił błąd podczas tworzenia danych:', error);
            throw new Error('Wystąpił błąd podczas tworzenia danych');
        }
    }

    public async query(deviceID: string) {
        try {
            return await DataModel.find({deviceId: deviceID}, {__v: 0, _id: 0});
        } catch (error) {
            throw new Error(`Query failed: ${error}`);
        }
    }

    public async get(deviceID: string, limit: number = 1) {
        try {
            return await DataModel.find({deviceId: deviceID}, {__v: 0, _id: 0}).limit(limit).sort({$natural: -1});
        } catch (error) {
            throw new Error(`Query failed: ${error}`);
        }
    }

    public async getAllNewest() {
        const latestData = await Promise.all(
            Array.from({ length: config.supportedDevicesNum }, async (_, i) => {
                try {
                    const latestEntry = await DataModel.find(
                        { deviceId: i },
                        { __v: 0, _id: 0 }
                    ).limit(1).sort({ $natural: -1 });

                    if (latestEntry.length) {
                        return latestEntry[0];
                    } else {
                        return { deviceId: i };
                    }
                } catch (error) {
                    console.error(`Błąd podczas pobierania danych dla urządzenia ${i}: ${error.message}`);
                    return {};
                }
            })
        );

        return latestData
    }

    public async deleteData(deviceID: string) {
        try {
            const result = await DataModel.deleteMany({ deviceId: deviceID });
            return result;
        } catch (error) {
            throw new Error(`Query failed: ${error}`);
        }
    }
}
