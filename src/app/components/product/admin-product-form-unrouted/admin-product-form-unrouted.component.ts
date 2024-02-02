import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IProduct, ICategory, formOperation } from 'src/app/model/model.interfaces';
import { ProductAjaxService } from 'src/app/service/product.ajax.service';
import { MediaService } from 'src/app/service/media.service';
import { AdminCategorySelectionUnroutedComponent } from '../../category/admin-category-selection-unrouted/admin-category-selection-unrouted.component';

@Component({
  selector: 'app-admin-product-form-unrouted',
  templateUrl: './admin-product-form-unrouted.component.html',
  styleUrls: ['./admin-product-form-unrouted.component.css']
})
export class AdminProductFormUnroutedComponent implements OnInit {

  @Input() id: number = 1;
  @Input() operation: formOperation = 'NEW';

  productForm!: FormGroup;
  product: IProduct = { image: '', category: {} } as IProduct;
  status: HttpErrorResponse | null = null;
  dynamicDialogRef: DynamicDialogRef | undefined;
  temporadas: string[] = [];
  selectedCategory: ICategory | undefined;
  selectedImageUrl: string | undefined = '';
  
  constructor(
    private formBuilder: FormBuilder,
    private productAjaxService: ProductAjaxService,
    private mediaService: MediaService,
    private router: Router,
    private matSnackBar: MatSnackBar,
    private dialogService: DialogService
  ) {
    this.initializeForm(this.product);
   }

  initializeForm(product: IProduct) {
    this.productForm = this.formBuilder.group({
      id: [this.product.id],
      name: [this.product.name, [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      stock: [this.product.stock, [Validators.required]],
      size: [this.product.size, [Validators.required]],
      price: [this.product.price, [Validators.required]],
      image: [this.product.image],
      category: this.formBuilder.group({
        id: [this.product.category.id, [Validators.required]],
      }),
    });
  }

  ngOnInit() {
    if (this.operation == 'EDIT') {
      this.productAjaxService.getProductById(this.id).subscribe({
        next: (data: IProduct) => {
          this.product = data;
          this.initializeForm(this.product);
        },
        error: (err: HttpErrorResponse) => {
          this.status = err;
          this.matSnackBar.open('Error al obtener el registro', 'Aceptar', {duration: 3000});
        }
      });
    } else {
      this.initializeForm(this.product);
    }
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      this.mediaService.uploadFile(formData).subscribe({
        next: (response) => {
          this.selectedImageUrl = response.url;
          this.product.image = response.url;
          this.productForm.controls['image'].patchValue(response.url);

        },
        error: (error) => {
          this.matSnackBar.open('Error al subir el fichero', 'Aceptar', {duration: 3000});
        }
      });
    }
  }

  public hasError = (controlName: string, error: string) => {
    return this.productForm.controls[controlName].hasError(error);
  }

  onSubmit() {
    if (this.productForm.valid) {
      if (this.operation == 'NEW') {
        this.productAjaxService.createProduct(this.productForm.value).subscribe({
          next: (data: IProduct) => {
            this.product = { "image": '', "category": {} } as IProduct; 
            this.product.id = data.id;
            this.initializeForm(this.product);
            this.matSnackBar.open('Registro creado correctamente', 'Aceptar', {duration: 3000});
            this.router.navigate(['/admin', 'product', 'view', this.product.id]);
          },
          error: (err: HttpErrorResponse) => {
            this.status = err;
            this.matSnackBar.open('Error al crear el registro', 'Aceptar', {duration: 3000});
          }
        });
      } else {
        this.productAjaxService.updateProduct(this.productForm.value).subscribe({
          next: (data: IProduct) => {
            this.product = data;
            this.initializeForm(this.product);
            this.matSnackBar.open('Registro actualizado correctamente', 'Aceptar', {duration: 3000});
            this.router.navigate(['/admin', 'product', 'view', this.product.id]);
          },
          error: (err: HttpErrorResponse) => {
            this.status = err;
            this.matSnackBar.open('Error al actualizar el registro', 'Aceptar', {duration: 3000});
          }
        });
      }
    }
  }

    onShowCategorySelection() {
      this.dynamicDialogRef = this.dialogService.open(AdminCategorySelectionUnroutedComponent, {
        header: 'Selección de Categoría',
        width: '70%',
        maximizable: true
      });
  
      if (this.dynamicDialogRef) {
        this.dynamicDialogRef.onClose.subscribe((category: ICategory) => {
          if (category) {
            this.selectedCategory = category;
            this.product.category = category;
            this.productForm.controls['category'].patchValue({ id: category.id });
            }
          });
        }
      }
    }