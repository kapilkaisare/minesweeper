import { Component, Listen, Prop, State, Watch, h } from '@stencil/core';
import { format } from '../../utils/utils';

@Component({
  tag: 'ms-cell',
  styleUrl: 'ms-cell.css',
  shadow: true,
})
export class MsCell {
  @Prop() mined: boolean = false;
  @Prop() minedNeighbors: number = 0;

  @State() revealed: boolean = false;
  @State() marked: boolean = false;

  @State() className: string = '';

  @Watch('revealed')
  @Watch('marked')
  computeClass() {
    let cellClass = '';
    if (this.marked) {
      cellClass = 'marked';
    } else if (this.revealed && this.mined) {
      cellClass = 'blown';
    } else  if (this.revealed && !this.mined) {
      cellClass = 'revealed';
    }
    if (cellClass !== '') {
      this.className = cellClass;
    }
  }

  @Listen('click')
  reveal() {
    if (!this.revealed) {
      this.revealed = true;
    }
  }

  @Listen('contextmenu')
  mark() {
    if (!this.revealed) {
      this.marked = !this.marked;
    }
  }

  getRevealedView() {
    if (this.mined) {
      return <div class='content blown'></div>;
    } else {
      return <div class='content'>{this.minedNeighbors > 0 ? this.minedNeighbors.toString() : ''}</div>;
    }
  }

  getMarkedView() {
    return <div class='content marked'></div>
  }

  getNormalView() {
    return <div class='content'></div>;
  }

  render() {
    return <div class='cell {this.className}'>
      {this.revealed ? this.getRevealedView() : null}
      {this.marked ? this.getMarkedView() : null}
      {(!this.marked && !this.revealed) ? this.getNormalView() : null}
    </div>;
  }
}
