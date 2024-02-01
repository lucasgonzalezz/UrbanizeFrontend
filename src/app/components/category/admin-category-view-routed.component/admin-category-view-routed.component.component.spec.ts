/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AdminCategoryViewRouted.componentComponent } from './admin-category-view-routed.component.component';

describe('AdminCategoryViewRouted.componentComponent', () => {
  let component: AdminCategoryViewRouted.componentComponent;
  let fixture: ComponentFixture<AdminCategoryViewRouted.componentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminCategoryViewRouted.componentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminCategoryViewRouted.componentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
