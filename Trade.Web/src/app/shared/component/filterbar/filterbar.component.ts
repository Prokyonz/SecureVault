import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-filterbar',
  templateUrl: './filterbar.component.html',
  styleUrls: ['./filterbar.component.scss']
})
export class FilterbarComponent {  
  @Output() onClickSearchButton = new EventEmitter<{startDate: Date, endDate: Date}>();
  startDate: Date;
  endDate: Date;

  onClick() {
    this.onClickSearchButton.emit({startDate: this.startDate, endDate: this.endDate});
  }
}
