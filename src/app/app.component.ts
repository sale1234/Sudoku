import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SudokuGameComponent } from './sudoku-game/sudoku-game.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, SudokuGameComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'sugoku';
}
