import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ICategory, formOperation } from 'src/app/model/model.interfaces';
import { CategoryAjaxService } from 'src/app/service/category.ajax.service';

@Component({
  selector: 'app-admin-category-form-unrouted',
  templateUrl: './admin-category-form-unrouted.component.html',
  styleUrls: ['./admin-category-form-unrouted.component.css']
})
export class AdminCategoryFormUnroutedComponent implements OnInit {

  @Input() id: number = 1;
  @Input() operation: formOperation = 'NEW';

  categoryForm!: FormGroup;
  category: ICategory = {} as ICategory;
  status: HttpErrorResponse | null = null;

  constructor(
    private categoryAjaxService: CategoryAjaxService,
    private formBuilder: FormBuilder,
    private router: Router,
    private matSnackBar: MatSnackBar
  ) { 
    this.initializeForm(this.category);
  }

  initializeForm(category: ICategory) {
    this.categoryForm = this.formBuilder.group({
      id: [this.category.id],
      name: [category.name, [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    });
  }

  ngOnInit() {
    if (this.operation === 'EDIT') {
      this.categoryAjaxService.getCategoryById(this.id).subscribe({
        next: (data: ICategory) => {
          this.category = data;
          this.initializeForm(this.category);
        },
        error: (err: HttpErrorResponse) => {
          this.status = err;
          this.matSnackBar.open("Error al obtener el registro", 'Aceptar', { duration: 3000});
        }
      });
      } else {
        this.initializeForm(this.category);
      }
    }

    public hasError = (controlName: string, errorName: string) => {
      return this.categoryForm.controls[controlName].hasError(errorName);
    }

    onSubmit() {
      if (this.operation === 'NEW') {
        this.categoryAjaxService.createCategory(this.categoryForm.value).subscribe({
          next: (data: ICategory) => {
            this.category = data;
            this.initializeForm(this.category);
              this.router.navigate(['/admin', 'category', 'plist']);
            
            this.matSnackBar.open("Registro creado", 'Aceptar', { duration: 3000});
          },
          error: (err: HttpErrorResponse) => {
            this.status = err;
            this.matSnackBar.open("Error al crear el registro", 'Aceptar', { duration: 3000});
          }
        });
      } else {
        this.categoryAjaxService.updateCategory(this.categoryForm.value).subscribe({
          next: (data: ICategory) => {
            this.category = data;
            this.initializeForm(this.category);
            this.matSnackBar.open("Registro actualizado", 'Aceptar', { duration: 3000});
            this.router.navigate(['/admin', 'category', 'view', this.category.id]);
          },
          error: (err: HttpErrorResponse) => {
            this.status = err;
            this.matSnackBar.open("Error al actualizar el registro", 'Aceptar', { duration: 3000});
          }
        });
      }
    }
    


  }

