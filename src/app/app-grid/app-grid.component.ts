import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'lib-app-grid',
  templateUrl: './app-grid.component.html',
  styleUrls: ['./app-grid.component.scss'],
})

export class AppGridComponent implements OnInit {

  storedArrayIndexValue = -1;
  lockClickEventStatus = false;
  dynamicInputForm: FormGroup;
  dWrapper: any;
  openEditBottom: boolean;
  rowClick: boolean;
  intializeDataInput = {};
  currentClickedPosY = 0;
  currentClickedPosX = 0;
  diceLeft: any;
  gridEnableEdit = false;
  optionsIsOpen = false;
  copyOfGridData: any;
  fetchFlag = false;
  previousScrollState: any;
  gridHeader;
  headerCheckBox: boolean;
  header = [];
  gridArrayView = [];
  gridColumnView = [];
  dataSource;
  diceTop = 0;
  recordStart = 0;
  recordEnd = 10;
  elements = ['icon', 'Active'];
  iconTag = '';
  arrow = {};
  selectionCache: boolean;
  alteredData = {};
  highlight = false;
  diceMenuActive = false;
  menuList = [];
  selectedElement = null;

  refreshGridStatus = {
    addNewRowTrigged: false,
    patchData: {},
    setPatchData: () => {
      for (const key in this.intializeDataInput) {
        if (this.intializeDataInput.hasOwnProperty(key)) {
          this.refreshGridStatus.patchData[key] = this.intializeDataInput[key];
        }
      }
    },
    triggerAddNewRowTrigged: () => {

      if (this.dynamicInputForm.status === 'VALID' || this.dynamicInputForm.status === 'DISABLED') {
        this.refreshGridStatus.addNewRowTrigged = true;
      }
    },
    closeGridRow: () => {
      this.enableEdit = false;
      this.dynamicInputForm.patchValue(this.refreshGridStatus.patchData);
      this.dynamicInputForm.disable();
    },
    addGridRow: (argumentData = null) => {
      this.enableEdit = false;
      this.dynamicInputForm.enable();
      this.enableEdit = true;
      this.dynamicInputForm.patchValue(argumentData || this.refreshGridStatus.patchData);
      this.refreshGridStatus.addNewRowTrigged = false;
    },
    refreshStatus: (argumentData = null) => {
      this.dynamicInputForm.reset();
      if (this.refreshGridStatus.addNewRowTrigged === true) {
        this.refreshGridStatus.addGridRow(argumentData);
      } else {
        this.refreshGridStatus.closeGridRow();
      }
      this.refreshGridStatus.addNewRowTrigged = false;
    }
  };

  @Input() adjustHeader;
  @Input() set gridFormGroup(value: FormGroup) {
    this.dynamicInputForm = value;
  }
  @Input() set gridData(value) {
    this.gridArrayView = value;
    if (this.gridArrayView && this.gridArrayView.length > 0 && this.gridEnableEdit === false && this.storedArrayIndexValue >= 0) {
      this.activateIndex(this.storedArrayIndexValue, this.gridArrayView[this.storedArrayIndexValue]);
    }
  }
  @Input() set gridColumns(value) {
    this.gridColumnView = value;
    if (value) {
      this.checkGlobalClickActivation(value);
    }
  }
  @Input() set intializeData(value) {
    this.intializeDataInput = value;
    this.alteredData = this.intializeDataInput;
    this.refreshGridStatus.setPatchData();
  }
  @Input() viewMode = false;
  @Input() set lockClickEvent(value) {
    this.lockClickEventStatus = value;
    if (value) {
      this.checkGlobalClickActivation(this.gridColumnView);
    }
  }
  @Input() gridElements: Object;
  @Input() totalItems: number;
  @Input() itemsPerScroll: number;
  @Input() height: any = '20vh';
  @Input() checkAllBox: boolean;
  @Input() tableHolderWidth: any = '100%';
  @Input() set enableEdit(value: any) {
    this.gridEnableEdit = value;
    this.enableEditChange.emit(value);
    this.clearInput();
  }
  @Input() set enableEditOnEnd(bool: boolean) {
    this.openEditBottom = bool;
  }

  @Output() fetchRecord = new EventEmitter();
  @Output() eventOnSelect = new EventEmitter();
  @Output() selectionEvent = new EventEmitter();
  @Output() eventOnSelectAll = new EventEmitter();
  @Output() alteredDataSet = new EventEmitter();
  @Output() enableEditChange = new EventEmitter<Boolean>();

  @ViewChild('wrapper') set Wrapper(value) {
    this.dWrapper = value;
    if (this.dWrapper && this.openEditBottom) {
      this.dWrapper.nativeElement.scrollTop = this.dWrapper.nativeElement.scrollHeight;
    }
  }

  constructor(public detectref: ChangeDetectorRef,
    public router: Router,
    public fb: FormBuilder) { }

  ngOnInit() {
    if (this.gridArrayView && this.gridArrayView.length > 0) {
      this.gridHeader = Object.keys(this.gridArrayView[0]);
    }
    this.header = this.gridColumnView.map(column => {
      return column['displayName'];
    });
  }

  setHeaderColumnWidth(columnwidth) {
    if (this.adjustHeader) {
      return columnwidth - this.adjustHeader;
    }
    return columnwidth;
  }

  setHighlight(arrayIndex) {
    if (this.highlight === true && this.gridArrayView[arrayIndex - 1] && !this.gridArrayView[arrayIndex - 1].hidden) {
      this.highlight = false;
      return true;
    }
    this.highlight = true;
    return false;
  }

  activateIndex(arrayIndexValue, data) {
    this.activateRow(arrayIndexValue);
    this.selectedData(data, arrayIndexValue);
  }

  rowClickActivity(element, arrayIndex) {
    if (this.lockClickEventStatus === false) {
      if (!this.dynamicInputForm || this.dynamicInputForm.status !== 'INVALID') {
        this.activateIndex(arrayIndex, element);
      } else {
        this.eventOnSelect.emit(this.dynamicInputForm);
      }
    }
  }

  activateClick(event, header) {
    if (!this.rowClick && header.activateClickEvent === true) {
      return false;
    } else if (!this.rowClick) {
      event.stopPropagation();
    }
  }

  checkEditChange(event, keyName) {
    this.alteredData[keyName] = event;
    this.alteredDataSet.emit(this.alteredData);
  }

  setSorting(column) {
    this.arrow[column] = this.arrow[column] === 'arrow_upward' ? 'arrow_downward' : 'arrow_upward';
    Object.keys(this.arrow).map((key) => {
      if (key !== column) { this.arrow[key] = ''; }
    });
    this.sortAndDisplay(column);
  }

  isElement(headerData) {
    const val = headerData.type ? headerData.type : 'text';
    return val;
  }

  onScrollEvent() {
    if (this.recordEnd < this.totalItems) {
      if ((this.previousScrollState !== this.dWrapper.nativeElement.scrollTop) &&
        ((this.dWrapper.nativeElement.scrollHeight - this.dWrapper.nativeElement.clientHeight)
          * (70 / 100) < this.dWrapper.nativeElement.scrollTop) && this.fetchFlag === false) {
        this.fetchFlag = true;
        setTimeout(() => {
          this.fetchFlag = false;
        }, 1000);
        this.recordStart = this.recordEnd;
        this.recordEnd = this.recordStart + this.itemsPerScroll;
        this.detectref.detectChanges();
        this.fetchRecord.emit({ 'start': this.recordStart, 'end': this.recordEnd });
      }
    }
    this.previousScrollState = this.dWrapper.nativeElement.scrollTop;
  }

  selectAll(checked, header) {
    if (checked === true) {
      if (this.isAllChecked(this.gridArrayView, header).length === 0 || this.isAllChecked(this.gridArrayView, header).length === this.gridArrayView.length) {
        this.selectionCache = false;
      } else {
        this.selectionCache = true;
        this.copyOfGridData = JSON.parse(JSON.stringify(this.gridArrayView));
      }
      this.gridArrayView.forEach(data => {
        data[header.valueAs] = header.trueValue;
      });
    } else {
      this.gridArrayView.forEach((element, index) => {
        element[header.valueAs] = this.selectionCache ? this.copyOfGridData[index][header.valueAs] : header.falseValue;
      });
    }
    this.eventOnSelectAll.emit(this.gridArrayView);
  }

  // openDiceMenu(arrayIndex = null, list) {
  //   // this.setMenuList(list);
  //   if (this.checkDiceMenuLockStatus()) {
  //     return true;
  //   }
  //   if (arrayIndex !== null && arrayIndex >= 0) {
  //     this.diceMenuActive = true;
  //   } else {
  //     this.optionsIsOpen = true;
  //   }
  // }

  // closeMenu() {
  //   this.optionsIsOpen = false;
  //   this.diceMenuActive = false;
  // }

  handleUrlCheck(header) {
    if (header && header.internalUrl) {
      return true;
    } else if (header && header.externalUrl) {
      return true;
    }
    return false;
  }

  handleUrlClick() {
    return true;
  }

  isVisible(header, element) {
    if (header && (header.showOnlyIf || header.showOnlyIf === '')) {
      if (header.showOnlyIf === element[header.valueAs]) {
        element.hidden = false;
      } else if (header.showOnlyIf === '') {
        element.hidden = false;
      } else {
        element.hidden = true;
      }
    }
  }

  getMenuList(header, element) {
    this.selectedElement = element;
    if (header['menuOptions']) {
      if (Array.isArray(header['menuOptions'])) {
        return header['menuOptions'];
      } else {
        const key = Object.keys(header['menuOptions']);
        return header['menuOptions'][key[0]][element[key[0]]] || [];
      }
    } else {
      return [];
    }
  }

  clearInput() {
    this.gridColumnView.map(data => {
      data[data['valueAs']] = null;
    });
  }

  deleteAction() {

  }

  setHeight() {
    return { 'height': this.height };
  }

  menuClick(menudata, element) {

  }

  private checkGlobalClickActivation(header) {
    if (!header) {
      return true;
    }
    if (header.filter((element) => {
      return element.activateClickEvent === true;
    }).length > 0) {
      this.rowClick = false;
    } else {
      this.rowClick = true;
    }
  }

  private activateRow(arrayIndexValue = null) {
    if (this.gridArrayView.length > 0) {
      this.gridArrayView.map(data => {
        data['activeRow'] = false;
      });
      this.gridArrayView[arrayIndexValue]['activeRow'] = true;
      this.storedArrayIndexValue = -1;
      this.enableEdit = false;
    } else if (arrayIndexValue >= 0) {// store to use it later to activate index
      this.storedArrayIndexValue = arrayIndexValue;
    }
  }

  private selectedData(data, arrayIndex) {
    if (typeof data === 'object') {
      data.index = arrayIndex;
    }
    this.eventOnSelect.emit(data);
  }

  private isAllChecked(arr, header): any[] {
    const res = arr.filter(data => {
      return data[header.valueAs] === header.trueValue;
    });
    return res;
  }

  private sortAndDisplay(column) {
    if (this.arrow[column] === 'arrow_upward') {
      this.sortAscending(column);
    } else {
      this.sortDescending(column);
    }
  }

  private sortAscending(column) {
    this.gridArrayView = this.gridArrayView.sort((a, b) => {
      if (a[column] > b[column]) { return -1; } else
        if (a[column] < b[column]) { return 1; } else { return 0; }
    });
  }

  private sortDescending(column) {
    this.gridArrayView = this.gridArrayView.sort((a, b) => {
      if (a[column] < b[column]) { return -1; } else
        if (a[column] > b[column]) { return 1; } else { return 0; }
    });
  }
}
