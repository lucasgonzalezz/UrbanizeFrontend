import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationService } from 'primeng/api';
import { Subject } from 'rxjs';
import { CategoryAjaxService } from 'src/app/service/category.ajax.service';
import Swal from 'sweetalert2';

@Component({
  providers: [ConfirmationService],
  selector: 'app-admin-category-plist-routed',
  templateUrl: './admin-category-plist-routed.component.html',
  styleUrls: ['./admin-category-plist-routed.component.css']
})
export class AdminCategoryPlistRoutedComponent implements OnInit {

  forceReload: Subject<boolean> = new Subject<boolean>();
  bLoading: boolean = false;

  constructor(
    private categoryAjaxService: CategoryAjaxService,
    private confirmationService: ConfirmationService,
    private matSnackBar: MatSnackBar,
  ) { }

  ngOnInit() {
  }

  doGenerateRandom(amount: number) {
    this.bLoading = true;
    this.categoryAjaxService.generateCategories(amount).subscribe({
      next: (response: number) => {
        this.matSnackBar.open(`Se han generado ${response} categorias`, 'Aceptar', { duration: 3000 });
        this.bLoading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.matSnackBar.open(`Se ha producido un error al generar categorias aleatorios: ${err.message}`, 'Aceptar', { duration: 3000 });
        this.bLoading = false;
      }
    })
  }

  doEmpty($event: Event) {
    Swal.fire({
      title: "¿Estás seguro de eliminar todas las categorías?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#164e63",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        this.categoryAjaxService.deleteAllCategoryes().subscribe({
          next: (response: number) => {
            this.matSnackBar.open(`Todas las categorías han sido eliminadas`, 'Aceptar', { duration: 3000 });
            this.forceReload.next(true);
            this.bLoading = false;
          },
          error: (err: HttpErrorResponse) => {
            this.matSnackBar.open(`Se ha producido un error al eliminar todas las categorías: ${err.message}`, 'Aceptar', { duration: 3000 });
            this.bLoading = false;
          }
        });
      }
    });
  }
  

}