import { RowModel } from './row.model';
import { CellModel } from './cell.model';

export interface GridDataModel {
  items: {
    rows: Record<number, RowModel>;
    cells: Record<number, CellModel>;
  };
  root: number[]; // rows
}
