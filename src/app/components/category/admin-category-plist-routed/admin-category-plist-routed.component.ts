import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationService } from 'primeng/api';
import { Subject } from 'rxjs';
import { CategoryAjaxService } from 'src/app/service/category.ajax.service';

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
        this.matSnackBar.open(`Se han generado ${response} usuarios`, 'Aceptar', { duration: 3000 });
        this.bLoading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.matSnackBar.open(`Se ha producido un error al generar usuarios aleatorios: ${err.message}`, 'Aceptar', { duration: 3000 });
        this.bLoading = false;
      }
    })
  }

  doEmpty($event: Event) {
    this.confirmationService.confirm({
      target: $event.target as EventTarget,
      message: '¿Está seguro que desea eliminar todos los usuarios?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.categoryAjaxService.deleteAllCategoryes().subscribe({
          next: (response: number) => {
            this.matSnackBar.open(`Todos los usuarios han sido eliminados`, 'Aceptar', { duration: 3000 });
            this.forceReload.next(true);
            this.bLoading = false;
          },
          error: (err: HttpErrorResponse) => {
            this.matSnackBar.open(`Se ha producido un error al eliminar todos los usuarios: ${err.message}`, 'Aceptar', { duration: 3000 });
            this.bLoading = false;
          }
        })
      }
    })
  }

}