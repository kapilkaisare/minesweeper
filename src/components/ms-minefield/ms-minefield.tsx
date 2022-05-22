import { Component, Prop, h } from '@stencil/core';
import { format } from '../../utils/utils';

const range = (start, end) => {
  const ranged = [];
  for (let i = start; i < end; i++) { ranged.push(i); }
  return ranged;
};

const plantMine = () => (Math.floor(Math.random() * 10) > 5);
const makeBlueprint = (rows, columns) => range(0, rows).map(() => range(0, columns).map(plantMine));
const findMinedNeighbors = (blueprint, rowCount, colCount) => {
  const minedNeighbors = [];
  blueprint.forEach((row, rowIdx) => {
    minedNeighbors[rowIdx] = [];
    row.forEach((mined, colIdx) => {
      minedNeighbors[rowIdx][colIdx] = [
        (rowIdx !== 0 && colIdx !== 0 && blueprint[rowIdx - 1][colIdx - 1]),
        (rowIdx !== 0 && blueprint[rowIdx - 1][colIdx]),
        (rowIdx !== 0 && colIdx !== colCount - 1 && blueprint[rowIdx - 1][colIdx + 1]),
        (colIdx !== 0 && blueprint[rowIdx][colIdx - 1]),
        (colIdx !== colCount -1 && blueprint[rowIdx][colIdx + 1]),
        (rowIdx !== rowCount - 1 && colIdx !== 0 && blueprint[rowIdx + 1][colIdx - 1]),
        (rowIdx !== rowCount - 1 && blueprint[rowIdx + 1][colIdx]),
        (rowIdx != rowCount - 1 && colIdx !== colCount - 1 && blueprint[rowIdx + 1][colIdx + 1])
      ].reduce((prev, acc) => acc + (prev ? 1 : 0), 0);
    });
  });
  return minedNeighbors;
};

@Component({
  tag: 'ms-minefield',
  styleUrl: 'ms-minefield.css',
  shadow: true,
})
export class MsMinefield {
  @Prop() rows: number;
  @Prop() columns: number;

  render() {
    const mineBlueprint = makeBlueprint(this.rows, this.columns);
    // console.log(mineBlueprint);
    const minedNeighbors = findMinedNeighbors(mineBlueprint, this.rows, this.columns);
    // console.log(minedNeighbors);

    return <div></div>;
  }
}
