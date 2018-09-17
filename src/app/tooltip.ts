import { Directive, ElementRef, HostListener, Output, EventEmitter } from '@angular/core';

@Directive({
  selector: '[appTooltip]'
})
export class TooltipDirective {
  @Output() someEvent:EventEmitter<boolean> = new EventEmitter();
  enableTooltip = false;
  constructor(private el: ElementRef) {

   }

  @HostListener('change') onChange() {
    this.setTooltip();
  }

  @HostListener('window:resize', ['$event']) onResize() {
    this.setTooltip();
  }

  private setTooltip() {
    if(!this.enableTooltip && this.el.nativeElement.offsetWidth < this.el.nativeElement.scrollWidth) {
      this.enableTooltip = true;
      this.someEvent.emit(true);
    }
    else if (this.enableTooltip && this.el.nativeElement.offsetWidth == this.el.nativeElement.scrollWidth){
      this.enableTooltip = false;
      this.someEvent.emit(false);
    }
  }
}
