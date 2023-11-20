import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SudokuService } from './sudoku.service';

@Component({
  selector: 'app-sudoku-game',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sudoku-game.component.html',
  styleUrls: ['./sudoku-game.component.css'],
  host: {
    class: 'h-screen w-screen flex justify-center items-center flex-col',
  },
})
export class SudokuGameComponent {
  private sudokuService = inject(SudokuService);

  constructor() {}

  public levelsOfDifficulty: string[] = ['easy', 'medium', 'hard', 'random'];
  public sudokuResult = this.sudokuService.board;
  public isSolved = this.sudokuService.isSolved;
  public selectedInput!: { colIndex: number; rowIndex: number };

  public onValueChange(e: Event, colIndex: number, rowIndex: number): void {
    const value = (e.target as HTMLInputElement).valueAsNumber;

    this.sudokuService.updateBoard(value, colIndex, rowIndex);
  }

  public isReadonly(
    value: number,
    colIndex: number,
    rowIndex: number
  ): boolean {
    return this.sudokuService.isCellReadonly(value, colIndex, rowIndex);
  }

  public validate(): void {
    this.sudokuService.validate();
  }

  public solve(): void {
    this.sudokuService.solve();
  }

  public onLevelSelected(e: Event): void {
    const value = (e.target as HTMLInputElement).value;

    this.sudokuService.getNewPuzzleBasedOnLevelOfDifficulty(value);
  }

  public resetFormOnOriginal(): void {
    this.sudokuService.resetFormOnOriginal();
  }

  public onInputEntered(colIndex: number, rowIndex: number) {
    this.selectedInput = {
      colIndex,
      rowIndex,
    };
  }
}
