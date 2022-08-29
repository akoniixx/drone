import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {BASE_URL, httpClient, registerClient} from '../config/develop-config';

export class Authentication {
    static generateOtp(
        telNumber : String
    ): Promise<any>{
        return axios.post(BASE_URL + "/auth/droner/request-login-otp",{
            telephoneNo : telNumber,
            refCode : telNumber
          }).then(res=>{
            return res.data;
          }).catch(err=>
            console.log(err)
          )
    }
    static generateOtpRegister(
      telNumber : String
    ): Promise<any>{
      return axios.post(BASE_URL + "/auth/droner/request-register-otp",{
        telephoneNo : telNumber,
        refCode: telNumber
      }).then(res=>{
        console.log(res.data)
        return res.data;
      }).catch(err=>
        console.log(err)
      )
    }
    static login(
        telephoneNo: string,
        otpCode: string,
        token: string,
        refCode: string
    ): Promise<any>{
        return axios.post(BASE_URL + "/auth/droner/verify-otp",{
            telephoneNo: telephoneNo,
            otpCode: otpCode,
            token: token,
            refCode: refCode
          })
          .then(res=>{
            return res.data
          }).catch(err=> console.log(err))
    }
    static async logout(){
        await AsyncStorage.removeItem('token')
        await AsyncStorage.removeItem('droner_id')
    }
}

export class Register{
  static getDroneBrand(
    page : number,
    take : number,
  ): Promise<any> {
    return registerClient.get(BASE_URL + `/drone-brand?isActive=true&page=${page}&take=${take}`).then(response => {
      return response.data;
    })
    .catch(error => {
      console.log(error);
    });
  }
  static getDroneBrandType(
    id : string
  ): Promise<any> {
    return registerClient.get(BASE_URL + `/drone-brand/${id}`).then(response => {
      return response.data;
    })
    .catch(error => {
      console.log(error);
    });
  }
  static registerStep2(
    firstname : string,
    lastname : string,
    telephoneNo : string,
    id : string,
    address1 : string,
    provinceId : string,
    districtId : string,
    subdistrictId : string,
    postcode : string
  ): Promise<any> {
    return registerClient.post(BASE_URL + `/auth/droner/register`,{
      firstname : firstname,
      lastname : lastname,
      telephoneNo : telephoneNo,
      status: "OPEN",
      address : {
        address1 : address1,
        address2 : "",
        address3 : "",
        provinceId : provinceId,
        districtId : districtId,
        subdistrictId : subdistrictId,
        postcode : postcode,
        id : id
      }
    }).then(response => {
      return response.data;
    })
    .catch(error => {
      console.log(error);
    });
  }
}

export class TaskDatasource {
  static getTaskById(
    dronerID: string,
    taskStatus: Array<string>,
    page?: number,
    take?: number,
  ): Promise<any> {
    let taskStatusString = "";
    taskStatus.map((item)=> 
        taskStatusString +=`taskStatus=${item}&`
    )
    return httpClient
      .post(BASE_URL + `/tasks/task/task-droner?dronerId=${dronerID}&${taskStatusString}page=${page}&take=${take}`)
      .then(response => {
        return response.data;
      })
      .catch(error => {
        console.log(error);
      });
  }
}
