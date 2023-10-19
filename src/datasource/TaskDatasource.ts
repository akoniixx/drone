import {
  BASE_URL,
  httpClient,
  taskFormDataClient,
} from '../config/develop-config';
import crashlytics from '@react-native-firebase/crashlytics';

interface PayloadTask {
  taskId: string;
  reviewFarmerScore: number;
  reviewFarmerComment: string;
  updateBy: string;
  file: any;
  fileDrug: any;
}
export class TaskDatasource {
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

    const [fileName, fileNameDrug] = [payload.file, payload.fileDrug].map(
      el => {
        const filePathSplit = el.assets[0].uri.split('/');
        const fileName = el.assets[0].fileName
          ? el.assets[0].fileName
          : filePathSplit[filePathSplit.length - 1];
        return fileName;
      },
    );

    data.append('taskId', payload.taskId);
    data.append('reviewFarmerScore', payload.reviewFarmerScore);
    data.append('reviewFarmerComment', payload.reviewFarmerComment);
    data.append('file', {
      uri: payload.file.assets[0].uri,
      name: fileName,
      type: payload.file.assets[0].type,
    });
    data.append('fileDrug', {
      uri: payload.fileDrug.assets[0].uri,
      name: fileNameDrug,
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
}
