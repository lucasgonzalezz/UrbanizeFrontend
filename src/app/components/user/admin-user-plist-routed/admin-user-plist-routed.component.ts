import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationService } from 'primeng/api';
import { Subject } from 'rxjs';
import { UserAjaxService } from 'src/app/service/user.ajax.service';

@Component({
  providers: [ConfirmationService],
  selector: 'app-admin-user-plist-routed',
  templateUrl: './admin-user-plist-routed.component.html',
  styleUrls: ['./admin-user-plist-routed.component.css']
})
export class AdminUserPlistRoutedComponent implements OnInit {

  forceReload: Subject<boolean> = new Subject<boolean>();
  bLoading: boolean = false;

  constructor(
    private userAjaxService: UserAjaxService,
    private confirmationService: ConfirmationService,
    private matSnackBar: MatSnackBar,
  ) { }

  ngOnInit() {
  }

  doGenerateRandom(amount: number) {
    this.bLoading = true;
    this.userAjaxService.generateUsers(amount).subscribe({
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
        this.userAjaxService.deleteAllUsers().subscribe({
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