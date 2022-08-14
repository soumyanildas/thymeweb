import { DepartmentModified } from "./Department";

export interface Store {
  id: string;
  companyID: string;
  locationID: string;
  storeAddress: string;
  storeCity: string;
  storeEmail: string;
  storeName: string;
  storeNum: number;
  storePhone: string;
  storeState: string;
  storeZip: number;
  taxId: string;
  taxRate: number;
  open: boolean;
}

export interface StoreModified extends Store {
  departments: DepartmentModified[];
}
