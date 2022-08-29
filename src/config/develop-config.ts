import AsyncStorage from "@react-native-async-storage/async-storage"
import axios from "axios"

export const BASE_URL = 'https://api-dev-dnds.iconkaset.com'

axios.interceptors.request.use(async (config: any) => {
    const token = await AsyncStorage.getItem('token')
    config.headers["Authorization"] = `Bearer ${token}`;
    return config;
});

const registerInstance = axios.create({})

registerInstance.interceptors.request.use(async (config: any) => {
    const token = await AsyncStorage.getItem('token_register')
    config.headers["Authorization"] = `Bearer ${token}`;
    return config;
});

export const registerClient = registerInstance;
export const httpClient = axios;
