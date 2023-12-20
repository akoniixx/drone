import {BASE_URL, httpClient} from '../config/develop-config';

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

export const createTaskDatasource = {
  findFarmerByTel,
  getFarmerById,
  getImageByPath,
};
