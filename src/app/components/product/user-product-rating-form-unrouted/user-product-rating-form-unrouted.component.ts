import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IProduct, IUser, IRating } from 'src/app/model/model.interfaces';
import { ProductAjaxService } from './../../../service/product.ajax.service';
import { UserAjaxService } from './../../../service/user.ajax.service';
import { RatingAjaxService } from './../../../service/rating.ajax.service';


@Component({
  selector: 'app-user-product-rating-form-unrouted',
  templateUrl: './user-product-rating-form-unrouted.component.html',
  styleUrls: ['./user-product-rating-form-unrouted.component.css']
})
export class UserProductRatingFormUnroutedComponent implements OnInit {

  @Output() ratingAdded: EventEmitter<void> = new EventEmitter<void>();

  product_id: number | undefined;
  user_id: number | undefined;
  rating: IRating = { date: new Date(Date.now()), user: { id: 0}, product: { id: 0} } as IRating;
  user: IUser | undefined;
  product: IProduct | undefined;
  ratingForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private ratingAjaxService: RatingAjaxService,
    private userAjaxService: UserAjaxService,
    private productAjaxService: ProductAjaxService,
    private matSnackBar: MatSnackBar,
    public dialogService: DialogService,
    public dynamicDialogRef: DynamicDialogRef,
    public dynamicDialogCofig: DynamicDialogConfig  
  ) {
    this.user_id = this.dynamicDialogCofig.data.user_id;
    this.product_id = this.dynamicDialogCofig.data.product_id;
   }

   public hasError = (controlName: string, errorName: string) =>{
    return this.ratingForm.controls[controlName].hasError(errorName);
   }

  ngOnInit() {
    if (this.user_id !== undefined) {
      this.userAjaxService.getUserById(this.user_id).subscribe({
        next: (user: IUser) => {
          this.user = user;
        },
        error: (err) => {
          this.matSnackBar.open(err.error.message, 'Aceptar', { duration: 3000 });
        }
      });
    }

    if (this.product_id !== undefined) {
      this.productAjaxService.getProductById(this.product_id).subscribe({
        next: (product: IProduct) => {
          this.product = product;
        },
        error: (err) => {
          this.matSnackBar.open(err.error.message, 'Aceptar', { duration: 3000 });
        }
      });
      }
      this.initializeForm(this.rating);
    }

    initializeForm(rating: IRating) {
      this.ratingForm = this.formBuilder.group({
        id: [rating.id],
        date: [new Date(rating.date)],
        title: [rating.title, [Validators.required, Validators.minLength(2), Validators.maxLength(255)]],
        description: [rating.description, [Validators.required, Validators.minLength(2), Validators.maxLength(255)]],
        user: this.formBuilder.group({
          id: [this.user_id]
        }),
        product: this.formBuilder.group({
          id: [this.product_id]
        }),
        });
      }

      onSubmit() {
        const rating = this.ratingForm.value;
        this.ratingAjaxService.createRating(rating).subscribe({
          next: (data: IRating) => {
            this.matSnackBar.open('Valoración creada', 'Aceptar', { duration: 3000 });
            this.dynamicDialogRef.close(data);
            this.ratingAdded.emit();
          },
          error: (err) => {
            this.matSnackBar.open(err.error.message, 'Aceptar', { duration: 3000 });
          }
        });
      }

      onCancel() {
        this.dynamicDialogRef.close();
      }

    }
  

