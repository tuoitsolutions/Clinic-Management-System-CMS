import { ITableSort } from "../../Interfaces/ITable";

export interface TablePaginationModel {
  page: number;
  limit: number;
  sort: ITableSort;
  filters: FilterModel;
}

export interface FilterModel {
  search: string;
}
