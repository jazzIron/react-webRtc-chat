export type SEX_TYPE = 'FEMALE' | 'MALE';
export type ROLE_TYPE = 'ADMIN' | 'DOCTOR' | 'NURSE' | 'ANONYMOUS' | 'HOSPITAL';

export interface IApiResponse<T> {
  status: number;
  data: T;
  message: string | null;
  failure?: boolean;
}

export interface IApiRes {
  status: number;
  message: string | null;
}
export interface IListPagination {
  totalElements: number;
  totalPages: number;
  pageNumber: number;
  size: number;
  first: boolean;
  last: boolean;
}
