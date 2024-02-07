import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { IRating, formOperation } from 'src/app/model/model.interfaces';
import { RatingAjaxService } from '../../../service/rating.ajax.service';
import { AdminUserSelectionUnroutedComponent } from '../../user/admin-user-selection-unrouted/admin-user-selection-unrouted.component';
import { AdminProductSelectionUnroutedComponent } from '../../product/admin-product-selection-unrouted/admin-product-selection-unrouted.component';

@Component({
  selector: 'app-admin-rating-form-unrouted',
  templateUrl: './admin-rating-form-unrouted.component.html',
  styleUrls: ['./admin-rating-form-unrouted.component.css']
})
export class AdminRatingFormUnroutedComponent implements OnInit {

  @Input() id: number = 1;
  @Input() operation: formOperation = 'NEW';

  ratingForm!: FormGroup;
  rating: IRating = { date: new Date(Date.now()), user: {}, product: {} } as IRating;
  status: HttpErrorResponse | null = null;
  dynamicDialogRef: DynamicDialogRef | undefined;

  selectedUser: string = ''; // Add this line to define selectedUser variable
  selectedProducto: string = ''; // Add this line to define selectedProducto variable

  constructor(
    private formBuilder: FormBuilder,
    private ratingAjaxService: RatingAjaxService,
    private router: Router,
    private matSnackBar: MatSnackBar,
    public dialogService: DialogService
  ) { }

  initializeForm(rating: IRating) {
    this.ratingForm = this.formBuilder.group({
      id: [rating.id],
      date: [rating.date],
      title: [rating.title, [Validators.required]],
      description: [rating.description, [Validators.required, Validators.minLength(2), Validators.maxLength(255)]],
      user: this.formBuilder.group({
        id: [rating.user.id, [Validators.required]],
      }),
      product: this.formBuilder.group({
        id: [rating.product.id, [Validators.required]],
      })
    });
  }

  ngOnInit() {
    if (this.operation == 'EDIT') {
      this.ratingAjaxService.getRatingById(this.id).subscribe({
        next: (data: IRating) => {
          this.rating = data;
          this.initializeForm(this.rating);
        },
        error: (err: HttpErrorResponse) => {
          this.status = err;
          this.matSnackBar.open('Error al obtener la valoracion', 'Close', { duration: 3000 });
        }
      });
    } else {
      this.initializeForm(this.rating);
    }
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.ratingForm.controls[controlName].hasError(errorName);
  }

  onSubmit() {
    if (this.ratingForm.valid) {
      if (this.operation == 'NEW') {
        this.ratingAjaxService.createRating(this.ratingForm.value).subscribe({
          next: (data: IRating) => {
            this.rating = { "user": {}, "product": {} } as IRating;
            this.initializeForm(this.rating);
            this.matSnackBar.open('Valoración creada correctamente', 'Aceptar', { duration: 3000 });
            this.router.navigate(['/admin', 'rating', 'plist']);
          },
          error: (err: HttpErrorResponse) => {
            this.status = err;
            this.matSnackBar.open('Error al crear la valoración', 'Aceptar', { duration: 3000 });
          }
        });
      } else {
        this.ratingAjaxService.updateRating(this.ratingForm.value).subscribe({
          next: (data: IRating) => {
            this.rating = data;
            this.initializeForm(this.rating);
            this.matSnackBar.open('Valoración actualizada correctamente', 'Aceptar', { duration: 3000 });
            this.router.navigate(['/admin', 'rating', 'view', this.rating.id]);
          },
          error: (err: HttpErrorResponse) => {
            this.status = err;
            this.matSnackBar.open('Error al actualizar la valoración', 'Aceptar', { duration: 3000 });
          }
        });
      }
    }
  }

  onShowUsuariosSelection() {
    this.dynamicDialogRef = this.dialogService.open(AdminUserSelectionUnroutedComponent, {
      header: 'Selecciona un usuario',
      width: '70%',
      contentStyle: { "max-height": "350px", "overflow": "auto" },
      maximizable: true
    });
    this.dynamicDialogRef.onClose.subscribe((data: any) => {
      if (data) {
        this.selectedUser = data.name; // Assuming 'name' is the property you want to display
        this.ratingForm.controls['user'].setValue({ id: data.id });
      }
    });
  }

  onShowCamisetasSelection() {
    this.dynamicDialogRef = this.dialogService.open(AdminProductSelectionUnroutedComponent, {
      header: 'Selecciona un producto',
      width: '70%',
      contentStyle: { "max-height": "350px", "overflow": "auto" },
      maximizable: true
    });
    this.dynamicDialogRef.onClose.subscribe((data: any) => {
      if (data) {
        this.selectedProducto = data.name; // Assuming 'name' is the property you want to display
        this.ratingForm.controls['product'].setValue({ id: data.id });
      }
    });
  }

}
