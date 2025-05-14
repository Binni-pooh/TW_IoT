import Controller from '../interfaces/controller.interface';
import { Request, Response, NextFunction, Router } from 'express';

let testArr = [4,5,6,3,5,3,7,5,13,5,6,4,3,6,3,6];

class DataController implements Controller {
    public path = '/api/data';
    public router = Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}/latest`, this.getLatestReadingsFromAllDevices);
        this.router.get(`${this.path}/:id/latest`, this.getLatestData);
        this.router.get(`${this.path}/:id/:num`, this.getNumData);
        this.router.get(`${this.path}/:id`, this.getData);
        this.router.post(`${this.path}/:id`, this.addData);
        this.router.delete(`${this.path}/all`, this.deleteAllData);
        this.router.delete(`${this.path}/:id`, this.deleteData);
    }

    private getLatestReadingsFromAllDevices = async (request: Request, response: Response, next: NextFunction) => {
        response.json(testArr).status(200)
    }

    private getData = async (request: Request, response: Response, next: NextFunction) => {
        const { id } = request.params;

        response.status(200).json(testArr[parseInt(id)]);
    };

    private getLatestData = async (request: Request, response: Response, next: NextFunction) => {
        const { id } = request.params;

        response.status(200).json(Math.max(...testArr));
    }

    private getNumData = async (request: Request, response: Response, next: NextFunction) => {
        const { id, num } = request.params;

        response.status(200).json(testArr.slice(parseInt(id), parseInt(id)+parseInt(num)));
    }

    private addData = async (request: Request, response: Response, next: NextFunction) => {
        const { elem } = request.body;
        testArr.push(elem);

        response.json(testArr).status(200)
    }

    private deleteAllData = async (request: Request, response: Response, next: NextFunction) => {
        testArr = []

        response.status(200).json(testArr);
    }

    private deleteData = async (request: Request, response: Response, next: NextFunction) => {
        const { id} = request.params;

        response.status(200).json(testArr.splice(parseInt(id), 1));
    }
}

export default DataController;