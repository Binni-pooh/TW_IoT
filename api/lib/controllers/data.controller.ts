import Controller from '../interfaces/controller.interface';
import express, { Request, Response, NextFunction, Router } from 'express';
import { checkIdParam } from '../middlewares/deviceIdParam.middleware';
import DataService from "../modules/services/data.service";


let testArr = [4,5,6,3,5,3,7,5,13,5,6,4,3,6,3,6];

class DataController implements Controller {
    public path = '/api/data';
    public router = Router();
    public dataService: DataService = new DataService();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}/latest`, this.getLatestReadingsFromAllDevices);
        this.router.get(`${this.path}/:id/latest`, checkIdParam, this.getLatestData);
        this.router.get(`${this.path}/:id/:num`, checkIdParam, this.getNumData);
        this.router.get(`${this.path}/:id`, checkIdParam, this.getAllDeviceData);
        this.router.post(`${this.path}/:id`, checkIdParam, this.addData);
        this.router.delete(`${this.path}/all`, this.deleteAllData);
        this.router.delete(`${this.path}/:id`, checkIdParam, this.deleteData);
    }

    private getLatestReadingsFromAllDevices = async (request: Request, response: Response, next: NextFunction) => {
        const allData = await this.dataService.getAllNewest()

        response.json(allData).status(200)
    }

    private getAllDeviceData = async (request: Request, response: Response, next: NextFunction) => {
        const { id } = request.params;
        const allData = await this.dataService.query(id);

        response.status(200).json(allData);
    };

    private getLatestData = async (request: Request, response: Response, next: NextFunction) => {
        const { id } = request.params;
        const latestData = await this.dataService.get(id);

        response.status(200).json(latestData);
    }

    private getNumData = async (request: Request, response: Response, next: NextFunction) => {
        const { id, num } = request.params;
        const numLatestData = await this.dataService.get(id, parseInt(num));

        response.status(200).json(numLatestData);
    }

    private addData = async (request: Request, response: Response, next: NextFunction) => {
        const { air } = request.body;
        const { id } = request.params;

        const data = {
            temperature: air[0].value,
            pressure: air[1].value,
            humidity: air[2].value,
            deviceId: parseInt(id),
            readingDate : new Date()
        }

        try {

            await this.dataService.createData(data);
            response.status(200).json(data);
        } catch (error) {
            console.error(`Validation Error: ${error.message}`);
            response.status(400).json({ error: 'Invalid input data.' });
        }
    };

    private deleteAllData = async (request: Request, response: Response, next: NextFunction) => {
        testArr = []

        response.status(200).json(testArr);
    }

    private deleteData = async (request: Request, response: Response, next: NextFunction) => {
        const { id} = request.params;

        response.status(200).json(await this.dataService.deleteData(id));
    }
}

export default DataController;