import { Component, Prop, Watch, h } from '@stencil/core';
import { format } from '../../utils/utils';

const range = (start, end) => {
  const ranged = [];
  for (let i = start; i < end; i++) { ranged.push(i); }
  return ranged;
};

@Component({
  tag: 'ms-minefield',
  styleUrl: 'ms-minefield.css',
  shadow: true,
})
export class MsMinefield {
  private blueprint: Array<Array<Boolean>>;
  private mineCounts: Array<Array<number>>;

  @Prop() rows: number;
  @Prop() columns: number;

  @Watch('rows')
  @Watch('columns')
  connectedCallback() {
    this.makeBlueprint();
    this.determineMineCounts();
  }

  render() {
    const renderedMinefield = this.renderBlueprint();
    return <div>{renderedMinefield}</div>;
  }

  private makeBlueprint() {
    this.blueprint = range(0, this.rows)
    .map(() => range(0, this.columns)
      .map(() => (Math.floor(Math.random() * 10) > 5))
    );
  }

  private withNeighborIndices(row, col, pickFn) {
    return [
      (row !== 0 && col !== 0) ? pickFn.call(this, row - 1, col - 1) : null,
      (row !== 0) ? pickFn.call(this, row - 1, col) : null,
      (row !== 0 && col !== this.columns - 1) ? pickFn.call(this, row - 1, col - 1) : null,
      (col !== 0) ? pickFn.call(this, row, col - 1) : null,
      (col !== this.columns -1) ? pickFn.call(this, row, col + 1) : null,
      (row !== this.rows - 1 && col !== 0) ? pickFn.call(this, row + 1, col - 1) : null,
      (row !== this.rows - 1) ? pickFn.call(this, row + 1, col) : null,
      (row !== this.rows - 1 && col !== this.columns - 1) ? pickFn.call(this, row + 1, col + 1) : null
    ];
  }

  private determineMineCounts() {
    this.mineCounts = this.blueprint
    .map((row, rowIdx) => row
      .map((col, colIdx) => {
        const neighbors = this.withNeighborIndices(
          rowIdx, colIdx,
          (r, c) => { return this.blueprint[r][c]; }
        );
        return neighbors.reduce((acc, current) => acc + ((current !== null && current) ? 1 : 0), 0);
      })
    );
  }

  private renderBlueprint() {
    const rows = this.blueprint.map((row, rowIdx) => {
      return <tr>
        {this.renderColumns(row, rowIdx)}
      </tr>;
    });
    return <table><tbody>{rows}</tbody></table>;
  }

  private renderColumns(row, rowIdx) {
    return row.map(
      (column, colIdx) => <td>
        <ms-cell
          mined={column}
          minedNeighbors={this.mineCounts[rowIdx][colIdx]}
        ></ms-cell>
      </td>
    );
  }
}
