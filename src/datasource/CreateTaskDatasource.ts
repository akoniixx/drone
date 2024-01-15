import AsyncStorage from '@react-native-async-storage/async-storage';
import {BASE_URL, httpClient} from '../config/develop-config';
import {CreateTaskPayload} from '../entities/FarmerInterface';

export interface PayloadCal {
  farmerPlotId: string;
  cropName: string;
  raiAmount: number;
}

const findFarmerByTel = async (tel: string) => {
  return await httpClient
    .get(BASE_URL + '/farmer/telephone/' + tel)
    .then(res => res.data);
};
const getFarmerById = async (id: string) => {
  return await httpClient.get(BASE_URL + '/farmer/' + id).then(res => res.data);
};
const getImageByPath = async ({path}: {path: string}) => {
  return await httpClient(BASE_URL + '/file/geturl?path=' + path).then(
    res => res.data,
  );
};
const getPurposeSpray = async (cropName: string) => {
  return await httpClient
    .get(BASE_URL + `/tasks/crop/crop-name?name=${cropName}`)
    .then(res => res.data);
};

const getTargetSpray = async () => {
  return await httpClient
    .get(BASE_URL + '/tasks/target-spray/find-target-spray-on-task')
    .then(response => {
      return response.data;
    })
    .catch(error => {
      throw error;
    });
};
const calculatePriceTask = async (payload: PayloadCal) => {
  return await httpClient
    .post(BASE_URL + '/tasks/task/calculate-price', payload)
    .then(res => {
      return res.data;
    });
};
const createTask = async (payload: CreateTaskPayload) => {
  return await httpClient
    .post(BASE_URL + '/tasks/task/create-task-line', {
      ...payload,
      applicationType: 'DRONER',
    })
    .then(res => res.data);
};
const getFarmerEverBeen = async (payload: {
  search?: string;
  page?: number;
  take?: number;
}) => {
  const dronerId = await AsyncStorage.getItem('droner_id');

  const payloadToQuery = Object.keys({...payload})
    .map(key => key + '=' + payload[key as keyof typeof payload])
    .join('&');

  return await httpClient
    .get(
      BASE_URL +
        `/tasks/task-suggestion/farmer-ever-used?dronerId=${dronerId}&` +
        payloadToQuery,
    )
    .then(res => res.data);
};
export const createTaskDatasource = {
  findFarmerByTel,
  getFarmerById,
  getImageByPath,
  getPurposeSpray,
  getTargetSpray,
  calculatePriceTask,
  createTask,
  getFarmerEverBeen,
};
