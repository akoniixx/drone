import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  BASE_URL,
  httpClient,
  taskFormDataClient,
} from '../config/develop-config';
import crashlytics from '@react-native-firebase/crashlytics';
import moment from 'moment';

interface PayloadTask {
  taskId: string;
  reviewFarmerScore: number;
  reviewFarmerComment: string;
  updateBy: string;
  file?: any;
  fileDrug: any;
}
interface PayloadUploadImage {
  taskId: string;
  updateBy: string;
  orderImage?: number;
  file: {
    fileSize: number;
    uri: string;
    type: string;
    fileName?: string;
  };
  onProgressUpload: (progress: number) => void;
}

export interface GetTaskDroner {
  dronerId: string;
  taskStatus: Array<
    | 'OPEN'
    | 'WAIT_RECEIVE'
    | 'WAIT_START'
    | 'IN_PROGRESS'
    | 'WAIT_REVIEW'
    | 'DONE'
    | 'CANCELED'
  >;
  taskStatusPayment?: Array<'WAIT_PAYMENT' | 'DONE_PAYMENT' | 'SUCCESS'>;
  taskStatusDelay?: Array<
    'WAIT_APPROVE' | 'APPROVED' | 'REJECTED' | 'EXTENDED'
  >;
  sortField?: string;
  sortDirection: string;
  page: number;
  take: number;
}
export type CurrentTaskDroner = {
  taskStatus: Array<
    | 'OPEN'
    | 'WAIT_RECEIVE'
    | 'WAIT_START'
    | 'IN_PROGRESS'
    | 'WAIT_REVIEW'
    | 'DONE'
    | 'CANCELED'
  >;
  dronerId: string;
  page: number;
  take: number;
};
export class TaskDatasource {
  static async getCurrentTaskDroner({
    dronerId,
    taskStatus,
    page,
    take,
  }: CurrentTaskDroner): Promise<any> {
    let taskStatusString = '';
    taskStatus.map(item => (taskStatusString += `taskStatus=${item}&`));
    return httpClient
      .get(
        BASE_URL +
          `/tasks/task/current-task-droner?dronerId=${dronerId}&${taskStatusString}page=${page}&take=${take}`,
      )
      .then(response => {
        return response.data;
      })
      .catch(error => {
        crashlytics().log('getCurrentTaskDroner');
        crashlytics().recordError(error);
        crashlytics().setAttributes({
          dronerId: dronerId,
          taskStatus: taskStatusString,
        });
        throw error;
      });
  }
  static getTaskById(
    dronerID: string,
    taskStatus: Array<string>,
    page?: number,
    take?: number,
  ): Promise<any> {
    let taskStatusString = '';
    taskStatus.map(item => (taskStatusString += `taskStatus=${item}&`));
    return httpClient
      .post(
        BASE_URL +
          `/tasks/task/task-droner?dronerId=${dronerID}&${taskStatusString}page=${page}&take=${take}`,
      )
      .then(response => {
        return response.data;
      })
      .catch(error => {
        crashlytics().log('getTaskById');
        crashlytics().recordError(error);
        crashlytics().setAttributes({
          dronerId: dronerID,
          taskStatus: taskStatusString,
        });
        throw error;
      });
  }
  static async getAllTaskByFilter({
    taskStatusDelay,
    taskStatusPayment,
    taskStatus,
    ...payload
  }: GetTaskDroner): Promise<any> {
    const convertToArray = Object.keys(payload);
    let queryString = '';
    convertToArray.map(item => {
      queryString += `${item}=${payload[item as keyof typeof payload]}&`;
    });
    if (taskStatus) {
      taskStatus.map(item => (queryString += `taskStatus=${item}&`));
    }
    if (taskStatusPayment) {
      taskStatusPayment.map((item, index) => {
        const isLast = index === taskStatusPayment.length - 1;
        if (isLast) {
          queryString += `taskStatusPayment=${item}`;
        } else {
          queryString += `taskStatusPayment=${item}&`;
        }
      });
    }
    if (taskStatusDelay) {
      taskStatusDelay.map((item, index) => {
        const isLast = index === taskStatusDelay.length - 1;
        if (isLast) {
          queryString += `taskStatusDelay=${item}`;
        } else {
          queryString += `taskStatusDelay=${item}&`;
        }
      });
    }
    return httpClient
      .post(BASE_URL + '/tasks/task/task-droner?' + queryString)
      .then(response => {
        return response.data;
      });
  }

  static async getTaskDetail(taskId: string, dronerId: string): Promise<any> {
    return httpClient
      .post(
        BASE_URL +
          `/tasks/task/task-droner-detail?taskId=${taskId}&dronerId=${dronerId}`,
      )
      .then(response => {
        return response.data;
      })
      .catch(error => {
        crashlytics().log('getTaskDetail');
        crashlytics().recordError(error);
        crashlytics().setAttributes({
          taskId: taskId,
          dronerId: dronerId,
        });
        throw error;
      });
  }

  static async updateTaskStatus(
    id: string,
    dronerId: string,
    status: string,
    updateBy: string,
    statusRemark?: string,
  ): Promise<any> {
    const data = {
      id: id,
      dronerId: dronerId,
      status: status,
      statusRemark: statusRemark,
      updateBy: updateBy,
    };
    return httpClient
      .post(BASE_URL + '/tasks/task/update-task-status', data)
      .then(response => {
        return response.data;
      })
      .catch(err => {
        crashlytics().log('updateTaskStatus');
        crashlytics().recordError(err);
        crashlytics().setAttributes({
          id: id,
          dronerId: dronerId,
          status: status,
          statusRemark: statusRemark ? statusRemark : '',
          updateBy: updateBy,
        });
        throw err;
      });
  }

  static async receiveTask(
    taskId: string,
    dronerId: string,
    receive: boolean,
  ): Promise<any> {
    const data = {
      taskId,
      dronerId,
      receive,
    };

    return httpClient
      .post(BASE_URL + '/tasks/task/receive-task', data)
      .then(response => {
        return response.data;
      })
      .catch(err => {
        crashlytics().log('receiveTask');
        crashlytics().recordError(err);
        crashlytics().setAttributes({
          taskId: taskId,
          dronerId: dronerId,
          receive: receive ? 'true' : 'false',
        });
        throw err;
      });
  }

  static async finishTask(payload: PayloadTask) {
    const data = new FormData();

    // const [fileName, fileNameDrug] = [payload.file, payload.fileDrug].map(
    //   el => {
    //     const filePathSplit = el.assets[0].uri.split('/');
    //     const fileName = el.assets[0].fileName
    //       ? el.assets[0].fileName
    //       : filePathSplit[filePathSplit.length - 1];
    //     return fileName;
    //   },
    // );
    const [fileNameDrug] = [payload.fileDrug].map(el => {
      const filePathSplit = el.assets[0].uri.split('/');
      const fileName = el.assets[0]?.fileName
        ? el.assets[0].fileName
        : filePathSplit[filePathSplit.length - 1];
      return fileName;
    });

    data.append('taskId', payload.taskId);
    data.append('reviewFarmerScore', payload.reviewFarmerScore);
    data.append('reviewFarmerComment', payload.reviewFarmerComment);
    // data.append('file', {
    //   uri: payload.file.assets[0].uri,
    //   name: fileName,
    //   type: payload.file.assets[0].type,
    // });
    data.append('fileDrug', {
      uri: payload.fileDrug.assets[0].uri,
      name: fileNameDrug + moment().unix(),
      type: payload.fileDrug.assets[0].type,
    });
    data.append('updateBy', payload.updateBy);
    return taskFormDataClient
      .post(BASE_URL + '/tasks/task/finish-task', data)
      .then(response => {
        return response.data;
      })
      .catch(err => {
        crashlytics().log('finishTask');
        crashlytics().recordError(err);
        crashlytics().setAttributes({
          taskId: payload.taskId,
          reviewFarmerScore: payload.reviewFarmerScore
            ? payload.reviewFarmerScore.toString()
            : '',
          reviewFarmerComment: payload.reviewFarmerComment,
          updateBy: payload.updateBy,
        });
        throw err;
      });
  }

  static async onExtendTaskRequest({
    statusDelay = 'WAIT_APPROVE',
    ...payload
  }: {
    taskId: string;
    dateDelay: string;
    statusDelay?: string;
    delayRemark: string;
  }): Promise<any> {
    return httpClient
      .post(BASE_URL + '/tasks/task/request-extend', {
        statusDelay,
        ...payload,
      })
      .then(response => {
        return response.data;
      })
      .catch(err => {
        crashlytics().log('onExtendTaskRequest');
        crashlytics().recordError(err);
        crashlytics().setAttributes({
          taskId: payload.taskId,
          dateDelay: payload.dateDelay,
          statusDelay: statusDelay,
          delayRemark: payload.delayRemark,
        });
        throw err;
      });
  }
  static async openReceiveTask(id: string, isOpen: boolean): Promise<any> {
    const data = {id, isOpen};

    return httpClient
      .post(BASE_URL + '/droner/open-receive-task', data)
      .then(response => {
        return response.data;
      })
      .catch(err => {
        crashlytics().log('openReceiveTask');
        crashlytics().recordError(err);
        crashlytics().setAttributes({
          id: id,
          isOpen: isOpen ? 'true' : 'false',
        });
        throw err;
      });
  }

  static async multiUploadImage({
    file,
    taskId,
    updateBy,
    onProgressUpload,
  }: PayloadUploadImage): Promise<any> {
    const data = new FormData();
    const dronerId = await AsyncStorage.getItem('droner_id');
    const filePathSplit = file.uri.split('/');
    const fileName = file.fileName
      ? file.fileName
      : filePathSplit[filePathSplit.length - 1];
    data.append('dronerId', dronerId);
    data.append('taskId', taskId);
    data.append('updateBy', updateBy);
    data.append('file', {
      uri: file.uri,
      name: fileName[fileName.length - 1] + moment().unix(),
      type: file.type,
    });
    return taskFormDataClient
      .post(BASE_URL + '/tasks/task-image/image-finish-task', data, {
        onUploadProgress(progressEvent) {
          const progress = Math.round(
            (progressEvent.loaded / progressEvent.total) * 100,
          );

          onProgressUpload(progress);
        },
      })
      .then(response => {
        return response.data;
      })
      .catch(err => {
        crashlytics().log('multiUploadImage');
        crashlytics().recordError(err);
        crashlytics().setAttributes({
          dronerId: dronerId ? dronerId : '',
          taskId: taskId,
          updateBy: updateBy,
        });
        console.log('err :>> ', JSON.stringify(err, null, 2));
        throw err;
      });
  }
}
