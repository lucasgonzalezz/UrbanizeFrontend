import { MatSnackBar } from '@angular/material/snack-bar';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { Subject } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { RatingAjaxService } from '../../../service/rating.ajax.service';

@Component({
  providers: [ConfirmationService],
  selector: 'app-admin-rating-plist-routed',
  templateUrl: './admin-rating-plist-routed.component.html',
  styleUrls: ['./admin-rating-plist-routed.component.css']
})
export class AdminRatingPlistRoutedComponent implements OnInit {

  forceReload: Subject<boolean> = new Subject<boolean>();
  user_id: number;
  product_id: number;
  bLoading: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private ratingAjaxService: RatingAjaxService,
    private confirmationService: ConfirmationService,
    private matSnackBar: MatSnackBar
  ) {
    this.user_id = parseInt(this.activatedRoute.snapshot.paramMap.get('user_id') ?? "0");
    this.product_id = parseInt(this.activatedRoute.snapshot.paramMap.get('product_id') ?? "0");
    console.log(this.user_id);
    console.log(this.product_id);
   }

  ngOnInit() {
  }

  doGenerateRandom(amount: number) {
    this.bLoading = true;
    this.ratingAjaxService.generateRatinges(amount).subscribe({
      next: (response: number) => {
        this.matSnackBar.open(`Se han generado ${response} valoraciones`, 'Aceptar', { duration: 3000 });
        this.bLoading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.matSnackBar.open(`Se ha producido un error al generar valoraciones aleatorias: ${err.message}`, 'Aceptar', { duration: 3000 });
        this.bLoading = false;
      }
    })
  }

  doEmpty(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: '¿Está seguro que desea eliminar todas las valoraciones?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.ratingAjaxService.deleteAllRatinges().subscribe({
          next: (response: number) => {
            this.matSnackBar.open(`Todas las valoraciones han sido eliminadas, ahora hay ${response} valoraciones`, 'Aceptar', { duration: 3000 });
            this.forceReload.next(true);
            this.bLoading = false;
          },
          error: (err: HttpErrorResponse) => {
            this.matSnackBar.open(`Se ha producido un error al eliminar todas las valoraciones: ${err.message}`, 'Aceptar', { duration: 3000 });
            this.bLoading = false;
          }
        });
      },
      reject: () => {
        this.matSnackBar.open("Se ha cancelado la eliminación de las valoraciones", "Aceptar", { duration: 3000 });
        this.bLoading = false;
      }
    });
  }
  

}