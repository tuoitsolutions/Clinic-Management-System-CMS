interface CategoryEntity {
  categno?: number;
  categdesc?: string;
  notes?: string;
  priono?: number;
  isactive?: string;
  encodedat?: Date;
  encodedby?: string;
}

export interface CategoryTableModel {
  limit: number;
  count: number;
  begin: number;
  table: Array<CategoryEntity>;
}

export default CategoryEntity;
