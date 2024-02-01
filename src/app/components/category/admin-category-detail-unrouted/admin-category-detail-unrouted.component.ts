import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit, Optional } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ICategory } from 'src/app/model/model.interfaces';
import { CategoryAjaxService } from 'src/app/service/category.ajax.service';

@Component({
  selector: 'app-admin-category-detail-unrouted',
  templateUrl: './admin-category-detail-unrouted.component.html',
  styleUrls: ['./admin-category-detail-unrouted.component.css']
})
export class AdminCategoryDetailUnroutedComponent implements OnInit {

  @Input() id: number = 1;

  category: ICategory = {} as ICategory;
  status: HttpErrorResponse | null = null;

  constructor(
    private categoryAjaxService: CategoryAjaxService,
    @Optional() public ref: DynamicDialogRef,
    @Optional() public config: DynamicDialogConfig
  ) { 
    if (config) {
      if (config.data) {
        this.id = config.data.id;
      }
    }
  }

  ngOnInit() {
    this.getOne();
  }

  getOne() {
    this.categoryAjaxService.getCategoryById(this.id).subscribe({
      next: (data: ICategory) => {
        this.category = data;
      },
      error: (error: HttpErrorResponse) => {
        this.status = error;
      }
    });
  }

}