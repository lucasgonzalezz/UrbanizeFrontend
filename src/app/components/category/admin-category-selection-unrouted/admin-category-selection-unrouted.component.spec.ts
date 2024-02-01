/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AdminCategorySelectionUnroutedComponent } from './admin-category-selection-unrouted.component';

describe('AdminCategorySelectionUnroutedComponent', () => {
  let component: AdminCategorySelectionUnroutedComponent;
  let fixture: ComponentFixture<AdminCategorySelectionUnroutedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminCategorySelectionUnroutedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminCategorySelectionUnroutedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
