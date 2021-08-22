interface TblSortValueModel {
  column: string;
  direction: string;
}

export interface TblInitialSortModel {
  label: string;
  value: TblSortValueModel;
}

export interface TblColumnModel {
  label: string;
  width: number | string;
  align?: "inherit" | "left" | "center" | "right" | "justify";
  fixedWidth?: boolean;
}
