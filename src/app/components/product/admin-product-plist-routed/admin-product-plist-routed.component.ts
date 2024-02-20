import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationService } from 'primeng/api';
import { Subject } from 'rxjs';
import { ProductAjaxService } from 'src/app/service/product.ajax.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  providers: [ConfirmationService],
  selector: 'app-admin-product-plist-routed',
  templateUrl: './admin-product-plist-routed.component.html',
  styleUrls: ['./admin-product-plist-routed.component.css']
})
export class AdminProductPlistRoutedComponent implements OnInit {

  forceReload: Subject<boolean> = new Subject<boolean>();
  bLoading: boolean = false;
  category_id: number;

  constructor(
    private activatedRoute: ActivatedRoute,
    private productAjaxService: ProductAjaxService,
    private confirmationService: ConfirmationService,
    private matSnackBar: MatSnackBar,
  ) { 
    this.category_id = parseInt(this.activatedRoute.snapshot.paramMap.get('category_id') ?? "0");
  }

  ngOnInit() {
  }

  doGenerateRandom(amount: number) {
    this.bLoading = true;
    this.productAjaxService.generateProducts(amount).subscribe({
      next: (response: number) => {
        this.matSnackBar.open(`Se han generado ${response} productos`, 'Aceptar', { duration: 3000 });
        this.bLoading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.matSnackBar.open(`Se ha producido un error al generar productos aleatorios: ${err.message}`, 'Aceptar', { duration: 3000 });
        this.bLoading = false;
      }
    })
  }

  doEmpty($event: Event) {
    this.confirmationService.confirm({
      target: $event.target as EventTarget,
      message: '¿Está seguro que desea eliminar todos los productos?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.productAjaxService.deleteAllProducts().subscribe({
          next: (response: number) => {
            this.matSnackBar.open(`Todos los productos han sido eliminados`, 'Aceptar', { duration: 3000 });
            this.forceReload.next(true);
            this.bLoading = false;
          },
          error: (err: HttpErrorResponse) => {
            this.matSnackBar.open(`Se ha producido un error al eliminar todos los productos: ${err.message}`, 'Aceptar', { duration: 3000 });
            this.bLoading = false;
          }
        })
      }
    })
  }

}