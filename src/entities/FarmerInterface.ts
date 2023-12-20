interface Address {
  id: string;
  address1: string;
  address2: string;
  address3: string;
  provinceId: number;
  districtId: number;
  subdistrictId: number;
  postcode: string;
  createdAt: string;
  updatedAt: string;
}

export interface FarmerPlot {
  id: string;
  plotName: string;
  raiAmount: string;
  landmark: string;
  plantName: string;
  plantNature: string | null;
  mapUrl: string | null;
  lat: string;
  long: string;
  locationName: string;
  farmerId: string;
  plotAreaId: number;
  isActive: boolean;
  status: string;
  comment: string | null;
  reason: string | null;
}

interface File {
  id: string;
  fileName: string;
  fileType: string;
  resource: string;
  category: string;
  path: string;
}

export interface FarmerResponse {
  id: string;
  farmerCode: string;
  pin: string;
  firstname: string;
  lastname: string;
  nickname?: string;
  idNo: string;
  telephoneNo: string;
  status: string;
  reason: string | null;
  birthDate: string;
  addressId: string;
  createdAt: string;
  updatedAt: string;
  address: Address;
  farmerPlot: FarmerPlot[];
  file: File[];
  comment: string | null;
  isDelete: boolean;
  deleteDate: string | null;
  updateBy: string;
  createBy: string | null;
  profileImage: string | null;
  province: string;
  district: string;
  subdistrict: string;
}

export interface InjectionTime {
  cropId: string;
  id: string;
  purposeSprayName: string;
}
