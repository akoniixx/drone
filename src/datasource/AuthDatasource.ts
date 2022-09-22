import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {
  BASE_URL,
  httpClient,
  registerClient,
  uploadFileClient,
} from '../config/develop-config';

export class Authentication {
  static generateOtp(telNumber: String): Promise<any> {
    return axios
      .post(BASE_URL + '/auth/droner/request-login-otp', {
        telephoneNo: telNumber,
        refCode: telNumber,
      })
      .then(res => {
        return res.data;
      })
      .catch(err => {
        throw err;
      });
  }
  static async generateOtpRegister(telNumber: String): Promise<any> {
    return axios
      .post(BASE_URL + '/auth/droner/request-register-otp', {
        telephoneNo: telNumber,
        refCode: telNumber,
      })
      .then(res => {
        return res.data;
      })
      .catch(err => {
        throw err;
      });
  }
  static login(
    telephoneNo: string,
    otpCode: string,
    token: string,
    refCode: string,
  ): Promise<any> {
    return axios
      .post(BASE_URL + '/auth/droner/verify-otp', {
        telephoneNo: telephoneNo,
        otpCode: otpCode,
        token: token,
        refCode: refCode,
      })
      .then(res => {
        return res.data;
      })
      .catch(err => {
        throw err;
      });
  }
  static async logout() {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('droner_id');
  }
}

export class Register {
  static getDroneBrand(page: number, take: number): Promise<any> {
    return registerClient
      .get(BASE_URL + `/drone-brand?isActive=true&page=${page}&take=${take}`)
      .then(response => {
        return response.data;
      })
      .catch(error => {
        console.log(error);
      });
  }
  static getDroneBrandType(id: string): Promise<any> {
    return registerClient
      .get(BASE_URL + `/drone-brand/${id}`)
      .then(response => {
        return response.data;
      })
      .catch(error => {
        console.log(error);
      });
  }
  static async registerStep2(
    firstname: string,
    lastname: string,
    birthDate : Date,
    telephoneNo: string,
    address1: string,
    address2: string,
    provinceId: string,
    districtId: string,
    subdistrictId: string,
    postcode: string,
  ): Promise<any> {
    const droner_id = await AsyncStorage.getItem('droner_id');
    if (!droner_id) {
      return registerClient
        .post(BASE_URL + `/auth/droner/register`, {
          firstname: firstname,
          lastname: lastname,
          birthDate: birthDate,
          telephoneNo: telephoneNo,
          status: 'OPEN',
          address: {
            address1: address1,
            address2: address2,
            address3: '',
            provinceId: provinceId,
            districtId: districtId,
            subdistrictId: subdistrictId,
            postcode: postcode,
          },
        })
        .then(async response => {
          const droner_id = response.data.id;
          await AsyncStorage.setItem('droner_id', droner_id);
          return response.data;
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      return registerClient
        .post(BASE_URL + `/auth/droner/register`, {
          id: droner_id,
          firstname: firstname,
          lastname: lastname,
          telephoneNo: telephoneNo,
          status: 'OPEN',
          address: {
            address1: address1,
            address2: address2,
            address3: '',
            provinceId: provinceId,
            districtId: districtId,
            subdistrictId: subdistrictId,
            postcode: postcode,
          },
        })
        .then(async response => {
          const droner_id = response.data.id;
          await AsyncStorage.setItem('droner_id', droner_id);
          return response.data;
        })
        .catch(error => {
          console.log(error);
        });
    }
  }

  static async uploadProfileImage(
    image : any
  ): Promise<any> {
    const droner_id = await AsyncStorage.getItem('droner_id')
    const data = new FormData();
    data.append('file',{
      uri : image.assets[0].uri,
      name : image.assets[0].fileName,
      type : image.assets[0].type
    })
    data.append('resourceId',droner_id)
    data.append('resource',"DRONER")
    data.append('category',"PROFILE_IMAGE");
    return uploadFileClient.post(BASE_URL + '/file/upload', data).then(response => {
      return response.data;
    })
    .catch(error => {
      console.log(error);
    });
  }

  static async uploadDronerdrone(dronerDrone: any): Promise<any> {
    const droner_id = await AsyncStorage.getItem('droner_id');
    return registerClient
      .post(BASE_URL + `/auth/droner/register`, {
        id: droner_id,
        dronerDrone: dronerDrone,
        status: 'OPEN',
      })
      .then(async response => {
        return response.data;
      })
      .catch(error => {
        console.log(error);
      });
  }

  static async registerStep3(
    telephoneNo: string,
    provinceId: number,
    districtId: number,
    subdistrictId: number,
    locationName: string,
    expPlant: string[],
    lat: string,
    long: string,
  ): Promise<any> {
    const droner_id = await AsyncStorage.getItem('droner_id');
    return registerClient
      .post(BASE_URL + `/auth/droner/register`, {
        id: droner_id,
        status: 'OPEN',
        telephoneNo: telephoneNo,
        expPlant: expPlant,
        dronerArea: {
          lat: lat,
          long: long,
          provinceId: provinceId,
          districtId: districtId,
          subdistrictId: subdistrictId,
          locationName: locationName,
        },
      })
      .then(response => {
        return response.data;
      })
      .catch(error => {
        console.log(error);
      });
  }
  static async registerSkipStep4(): Promise<any> {
    const droner_id = await AsyncStorage.getItem('droner_id');
    return registerClient
      .post(BASE_URL + `/auth/droner/register`, {
        id: droner_id,
        status: 'PENDING',
      })
      .then(response => {
        return response.data;
      })
      .catch(error => {
        console.log(error);
      });
  }

  static async registerStep4(telephoneNo: string, idNo: string): Promise<any> {
    const droner_id = await AsyncStorage.getItem('droner_id');
    return registerClient
      .post(BASE_URL + `/auth/droner/register`, {
        id: droner_id,
        telephoneNo: telephoneNo,
        idNo: idNo,
      })
      .then(response => {
        return response.data;
      })
      .catch(error => {
        console.log(error);
      });
  }

  static async changeToPending(): Promise<any> {
    const droner_id = await AsyncStorage.getItem('droner_id');
    return httpClient.patch(
      BASE_URL + `/droner/${droner_id}`,{
        status : "PENDING"
      }).then(response => {
        return response.data;
      })
      .catch(error => {
        console.log(error);
    });
  }

  static async uploadDronerLicense(drone_id: any, file: any): Promise<any> {
    const data = new FormData();
    data.append('file', {
      uri: file.assets[0].uri,
      name: file.assets[0].fileName,
      type: file.assets[0].type,
    });
    data.append('resourceId', drone_id);
    data.append('resource', 'DRONER_DRONE');
    data.append('category', 'DRONER_LICENSE');
    return uploadFileClient
      .post(BASE_URL + '/file/upload', data)
      .then(response => {
        return response.data;
      })
      .catch(error => {
        console.log(error);
      });
  }
  static async uploadDroneLicense(drone_id: any, file: any): Promise<any> {
    const data = new FormData();
    data.append('file', {
      uri: file.assets[0].uri,
      name: file.assets[0].fileName,
      type: file.assets[0].type,
    });
    data.append('resourceId', drone_id);
    data.append('resource', 'DRONER_DRONE');
    data.append('category', 'DRONE_LICENSE');
    return uploadFileClient
      .post(BASE_URL + '/file/upload', data)
      .then(response => {
        return response.data;
      })
      .catch(error => {
        console.log(error);
      });
  }
  static async uploadDronerIDCard(file: any): Promise<any> {
    const droner_id = await AsyncStorage.getItem('droner_id');
    const data = new FormData();
    data.append('file', {
      uri: file.assets[0].uri,
      name: file.assets[0].fileName,
      type: file.assets[0].type,
    });
    data.append('resourceId', droner_id);
    data.append('resource', 'DRONER');
    data.append('category', 'ID_CARD_IMAGE');
    return uploadFileClient
      .post(BASE_URL + '/file/upload', data)
      .then(response => {
        return response.data;
      })
      .catch(error => {
        console.log(error);
      });
  }
}