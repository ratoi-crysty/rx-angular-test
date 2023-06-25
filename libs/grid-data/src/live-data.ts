import { GridDataModel } from './models/grid-data.model';
import { RowModel } from './models/row.model';
import { CellModel } from './models/cell.model';
import { keyBy } from 'lodash';

export type LiveDataSubscriber = (data: GridDataModel) => void;

export interface LiveDataOptions {
  minRows: number;
  maxRows: number;
  cellsPerRow: number;
  updateInterval: number;
}

export class LiveData {
  protected subscribers = new Set<LiveDataSubscriber>();
  protected rows = new Map<number, RowModel>();
  protected cells = new Map<number, CellModel>();
  protected data: GridDataModel = {
    items: {
      cells: {},
      rows: {},
    },
    root: [],
  };
  timer?: number;

  constructor(protected options: LiveDataOptions) {}

  start() {
    this.buildData();
    this.timer = +setInterval(() => {
      this.update();
      this.dispatch();
    }, this.options.updateInterval);
  }

  stop() {
    clearInterval(this.timer);
  }

  subscribe(subscriber: LiveDataSubscriber): () => void {
    this.subscribers.add(subscriber);

    return () => {
      this.subscribers.delete(subscriber);
    };
  }

  protected buildData() {
    let cellIndex = 0;

    for (let i = 0; i < this.options.maxRows; i++) {
      const row: RowModel = {
        id: i + 1,
        title: `Row title ${i}`,
        description: `Row description ${i}`,
        cells: [],
      };

      for (let j = 0; j < this.options.cellsPerRow; j++) {
        const cell: CellModel = {
          id: cellIndex++,
          title: `Cell title ${cellIndex}`,
          description: `Cell description ${cellIndex}`,
          value: this.getValue(),
        };

        this.cells.set(cell.id, cell);
        row.cells.push(cell.id);
      }

      this.rows.set(row.id, row);
    }

    this.data = {
      root: Array.from(this.rows.keys()),
      items: {
        rows: keyBy(Array.from(this.rows.values()), 'id'),
        cells: keyBy(Array.from(this.cells.values()), 'id'),
      },
    };
  }

  protected update() {
    // TODO: implement
  }

  protected dispatch() {
    this.subscribers.forEach((subscriber: LiveDataSubscriber) => subscriber(this.data));
  }

  protected getValue(): number {
    return this.getRandomNumber(0, 100, 2);
  }

  protected getChance(change: number): boolean {
    const percentage: number = this.getRandomNumber(0, 100);

    return percentage > change;
  }

  protected getMajorChance(): boolean {
    return this.getChance(20);
  }

  protected getMinorChance(): boolean {
    return this.getChance(90);
  }

  protected getRandomNumber(min: number, max: number, radix = 0) {
    const pow = Math.pow(10, radix);

    return Math.floor((Math.random() * (max - min) + min) * pow) / pow;
  }
}
