import axios from 'axios';
import {BASE_URL} from '../config/develop-config';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface GroupGuruKaset {
  page?: number;
  take?: number;
}
interface GuruKasetAll {
  page?: number;
  limit?: number;
  dronerId?: string;
  groupId?: string;
}
export class GuruKaset {
  static async findAllNews({
    status,
    application,
    categoryNews,
    sortField,
    sortDirection,
    limit,
    offset = 0,
    pageType,
  }: {
    status: string;
    application: string;
    categoryNews?: string;
    sortField?: string;
    sortDirection?: 'ASC' | 'DESC';
    limit?: number;
    offset?: number;
    pageType?: 'ALL' | 'MAIN';
  }): Promise<any> {
    return axios
      .post(BASE_URL + '/promotion/news/find-all-news', {
        status: status,
        application: application,
        categoryNews: categoryNews,
        sortField: sortField,
        sortDirection: sortDirection,
        limit: limit,
        offset: offset,
        pageType,
      })
      .then(res => {
        return res.data;
      });
  }
  static async getById(id: string): Promise<any> {
    return axios.get(BASE_URL + '/promotion/news/' + id).then(res => {
      return res.data;
    });
  }
  static async updateId(id: string, read: number): Promise<any> {
    return axios
      .post(BASE_URL + '/promotion/news/update/' + id, {read})
      .then(res => {
        return res.data;
      });
  }
  static async getGroupGuru({
    page = 1,
    take = 20,
  }: GroupGuruKaset): Promise<any> {
    return axios
      .get(BASE_URL + `/guru/group-guru?page=${page}&take=${take}`)
      .then(res => {
        return res.data;
      });
  }
  static async getAllGuru(payload: GuruKasetAll): Promise<any> {
    const dronerId = await AsyncStorage.getItem('droner_id');
    if (dronerId) {
      payload.dronerId = dronerId;
    }

    let query = '';
    for (let key in payload) {
      if (payload[key as keyof GuruKasetAll]) {
        query += `${key}=${payload[key as keyof GuruKasetAll]}&`;
      }
    }

    return axios.get(BASE_URL + `/guru/guru/query-app?${query}`).then(res => {
      return res.data;
    });
  }
  static async getGuruById({
    guruId,
    userType = 'DRONER',
  }: {
    guruId: string;
    userType?: 'DRONER' | 'FARMER';
  }): Promise<any> {
    const dronerId = (await AsyncStorage.getItem('droner_id')) || '';
    return axios
      .get(BASE_URL + `/guru/guru/query-app/${guruId}/${dronerId}/${userType}`)
      .then(res => {
        return res.data;
      });
  }
  static async updateFavoriteGuru({guruId}: {guruId: string}): Promise<any> {
    const dronerId = (await AsyncStorage.getItem('droner_id')) || '';
    return axios
      .post(BASE_URL + '/guru/like-guru', {
        guruId,
        dronerId: dronerId,
      })
      .then(res => {
        return res.data;
      });
  }
}
