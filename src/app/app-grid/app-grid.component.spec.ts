import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AppGridComponent } from './app-grid.component';

describe('SiGridComponent', () => {
  let component: AppGridComponent;
  let fixture: ComponentFixture<AppGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppGridComponent],
      imports: [
        RouterTestingModule
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    const displayedColumns = ['icon', 'Created', 'Product', 'Type', 'App/Policy #', 'Tran', 'Eff. From', 'Status', 'Premium',
      'Insured', 'St', 'Insured Cell#', 'Agency/Agent'];

    fixture = TestBed.createComponent(AppGridComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
    component.gridColumns = displayedColumns;
    component.gridData = [];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
