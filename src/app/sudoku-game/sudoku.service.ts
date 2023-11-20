import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Puzzle, Result } from './sudoku';

@Injectable({
  providedIn: 'root',
})
export class SudokuService {
  private http = inject(HttpClient);
  private url = 'https://sugoku.onrender.com/board?difficulty=random';

  public dynamicCell = new Set<string>();
  public isSolved = signal<Puzzle>('unsolved');

  public board = signal<number[][]>([]);
  public boardBeforeReset = signal<number[][]>([]);

  constructor() {
    this.http.get<Result['data']>(this.url).subscribe((data) => {
      this.board.set(data.board);
      this.boardBeforeReset.set(data.board);
    });
  }

  public updateBoard(value: number, colIndex: number, rowIndex: number): void {
    this.dynamicCell.add(`${colIndex}-${rowIndex}`);

    this.board.update((data) =>
      data.map((row: any, rIndex: number) => {
        if (rowIndex !== rIndex) return row;

        return row.map((col: any, cIndex: number) => {
          if (colIndex !== cIndex) return col;

          return value;
        });
      })
    );
  }

  public isCellReadonly(
    value: number,
    colIndex: number,
    rowIndex: number
  ): boolean {
    return value !== 0 && !this.dynamicCell.has(`${colIndex}-${rowIndex}`);
  }

  public validate() {
    const { url, body, headers } = this.getParams('validate');

    this.http
      .post<any>(url, body, {
        headers,
      })
      .subscribe(({ status }) => {
        this.isSolved.set(status);
      });
  }

  public solve() {
    const { url, body, headers } = this.getParams('solve');

    this.http
      .post<any>(url, body, {
        headers,
      })
      .subscribe((value) => {
        this.board.set(value.solution);
        this.isSolved.set(value.status);
      });
  }

  public getNewPuzzleBasedOnLevelOfDifficulty(difficultyLevel: string): void {
    const url = `https://sugoku.onrender.com/board?difficulty=${difficultyLevel}`;

    this.http.get<any>(url).subscribe((data) => {
      this.board.set(data.board);
      this.boardBeforeReset.set(data.board);
      this.isSolved.set('unsolved');
      this.dynamicCell.clear();
    });
  }

  public resetFormOnOriginal() {
    this.board.set(this.boardBeforeReset());
    this.isSolved.set('unsolved');
    this.dynamicCell.clear();
  }

  private encodeBoard = (board: number[][]) =>
    board.reduce(
      (result, row, i) =>
        result +
        `%5B${encodeURIComponent(row as any)}%5D${
          i === board.length - 1 ? '' : '%2C'
        }`,
      ''
    );

  private encodeParams = (params: { board: number[][] }) =>
    Object.keys(params)
      .map(
        (key) => key + '=' + `%5B${this.encodeBoard(params[key as 'board'])}%5D`
      )
      .join('&');

  private getParams(methodType: string) {
    const url = `https://sugoku.onrender.com/${methodType}`;
    const body = this.encodeParams({ board: this.board() });
    const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };

    return {
      url,
      body,
      headers,
    };
  }
}
