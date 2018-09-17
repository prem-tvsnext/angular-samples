import { Component } from '@angular/core';
import {Hotkey, HotkeysService} from 'angular2-hotkeys';
import { single } from './data';

export interface PeriodicElement {
  name: string;
  position: number;
  data1: number;
  data2: string;
  data3: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Name 1', data1: 1.0079, data2: 'A', data3: 'AAA111'},
  {position: 2, name: 'Name 2', data1: 4.0026, data2: 'B', data3: 'BBB222'},
  {position: 3, name: 'Name 3', data1: 6.941, data2: 'C', data3: 'CCC333'},
  {position: 4, name: 'Name 4', data1: 9.0122, data2: 'D', data3: 'DDD444'},
  {position: 5, name: 'Name 5', data1: 10.811, data2: 'E', data3: 'EEE555'},
  {position: 6, name: 'Name 6', data1: 12.0107, data2: 'F', data3: 'FFF666'},
  {position: 7, name: 'Name 7', data1: 14.0067, data2: 'G', data3: 'GGG777'},
  {position: 8, name: 'Name 8', data1: 15.9994, data2: 'H', data3: 'HHH888'},
  {position: 9, name: 'Name 9', data1: 18.9984, data2: 'I', data3: 'III999'},
  {position: 10, name: 'Name 10', data1: 20.1797, data2: 'J', data3: 'JJJ000'},
];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  tooltipText = '';
  textValue='';
  disbaleTooltip = true;
  disbaleTooltip1 = true;
  someMethod = (v) => {
    this.disbaleTooltip= !v;
  }
  displayedColumns: string[] = ['position', 'name', 'column1', 'column2'];
  availableColumns: string[] = ['data1', 'data2', 'data3']
  dynamicColumns: object[] = [{name: 'column1', field: 'data1'}, {name: 'column2', field: 'data2'}];
  dataSource = ELEMENT_DATA;

  addCol = () => {
    const columnName = 'column' + (this.dynamicColumns.length + 1)
    this.dynamicColumns.push({name: columnName, field: 'data1'})
    this.displayedColumns.push(columnName);
  }

  someMethod1 = (v) => {
    this.disbaleTooltip1 = !v;
  }

  single: any[];
  multi: any[];

  view: any[] = [700, 400];

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Country';
  showYAxisLabel = true;
  yAxisLabel = 'Population';

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  constructor(private _hotkeysService: HotkeysService) {
    this._hotkeysService.add(new Hotkey('mod+s', (event: KeyboardEvent): boolean => {
        console.log('mod+s');
        return false; // Prevent bubbling
    }));

    this._hotkeysService.add(new Hotkey('mod+d', (event: KeyboardEvent): boolean => {
      console.log('mod+d');
      return false; // Prevent bubbling
  }));

  this._hotkeysService.add(new Hotkey('mod+r', (event: KeyboardEvent): boolean => {
    console.log('mod+r');
    return false; // Prevent bubbling
}));

this._hotkeysService.add(new Hotkey('mod+up', (event: KeyboardEvent): boolean => {
  console.log('mod+up');
  return false; // Prevent bubbling
}));

this._hotkeysService.add(new Hotkey('mod+down', (event: KeyboardEvent): boolean => {
  console.log('mod+down');
  return false; // Prevent bubbling
}));

this._hotkeysService.add(new Hotkey('mod+right', (event: KeyboardEvent): boolean => {
  console.log('mod+right');
  return false; // Prevent bubbling
}));

this._hotkeysService.add(new Hotkey('mod+left', (event: KeyboardEvent): boolean => {
  console.log('mod+left');
  return false; // Prevent bubbling
}));

this._hotkeysService.add(new Hotkey('alt+left', (event: KeyboardEvent): boolean => {
  console.log('alt+left');
  return false; // Prevent bubbling
}));

this._hotkeysService.add(new Hotkey('alt+right', (event: KeyboardEvent): boolean => {
  console.log('alt+right');
  return false; // Prevent bubbling
}));

this._hotkeysService.add(new Hotkey('f11', (event: KeyboardEvent): boolean => {
  console.log('f11');
  return false; // Prevent bubbling
}));

this._hotkeysService.add(new Hotkey('f3', (event: KeyboardEvent): boolean => {
  console.log('f3');
  return false; // Prevent bubbling
}));

this._hotkeysService.add(new Hotkey('f6', (event: KeyboardEvent): boolean => {
  console.log('f6');
  return false; // Prevent bubbling
}));

this._hotkeysService.add(new Hotkey('f12', (event: KeyboardEvent): boolean => {
  console.log('f12');
  return false; // Prevent bubbling
}));

this._hotkeysService.add(new Hotkey('f10', (event: KeyboardEvent): boolean => {
  console.log('f10');
  return false; // Prevent bubbling
}));

    this._hotkeysService.add(new Hotkey(['ctrl+q',
      'f2',
      'f8',
      'f9'], (event: KeyboardEvent, combo: string): ExtendedKeyboardEvent => {
      console.log(combo);
      let e: ExtendedKeyboardEvent = event;
      e.returnValue = false; // Prevent bubbling
      return e;
    }));

    Object.assign(this, { single })
  }

  onSelect(event) {
    console.log(event);
  }
}
