export interface MaintenanceSystem {
    id: string;
    header: string;
    text: string;
    footer: string;
    dateStart: string;
    dateEnd: string;
    dateNotiStart: string;
    dateNotiEnd: string;
    imagePath: string;
    status: string;
    typeService: string;
    createdAt: string;
    updatedAt: string;
  }
  export const MaintenanceSystem_INIT: MaintenanceSystem = {
    id: '',
    header: '',
    text: '',
    footer: '',
    dateStart: '',
    dateEnd: '',
    dateNotiStart: '',
    dateNotiEnd: '',
    imagePath: '',
    status: '',
    typeService: '',
    createdAt: '',
    updatedAt: '',
  };
  