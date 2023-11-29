import axios from 'axios';
import {BASE_URL} from '../config/develop-config';

interface GroupGuruKaset {
  page?: number;
  take?: number;
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
  static async getGroupGuru(): Promise<any> {
    return axios.get(BASE_URL + '/promotion/news/group-guru').then(res => {
      return res.data;
    });
  }
}
