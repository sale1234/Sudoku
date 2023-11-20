export interface Result {
  data: {
    board: number[][];
  };
}

const PuzzleTypes = ['unsolved', 'solved', 'broken'] as const;
export type Puzzle = (typeof PuzzleTypes)[number];
