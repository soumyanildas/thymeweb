import { ItemModified } from "./Item";

export interface Department {
  readonly id: string;
  readonly deptName: string;
  readonly imgUrl: string;
  readonly position: number;
  readonly online: boolean;
  readonly showOnTS: boolean;
}

export interface DepartmentModified extends Department {
  readonly items: ItemModified[];
}
