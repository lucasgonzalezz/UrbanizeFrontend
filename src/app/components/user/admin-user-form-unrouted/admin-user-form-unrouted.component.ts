import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { IUser, formOperation } from 'src/app/model/model.interfaces';
import { UserAjaxService } from 'src/app/service/user.ajax.service';

@Component({
  selector: 'app-admin-user-form-unrouted',
  templateUrl: './admin-user-form-unrouted.component.html',
  styleUrls: ['./admin-user-form-unrouted.component.css']
})
export class AdminUserFormUnroutedComponent implements OnInit {

  @Input() id: number = 1;
  @Input() operation: formOperation = 'NEW';

  userForm!: FormGroup;
  user: IUser = {} as IUser;
  status: HttpErrorResponse | null = null;
  isFieldFocused: { [key: string]: boolean } = {};

  constructor(
    private userAjaxService: UserAjaxService,
    private formBuilder: FormBuilder,
    private router: Router,
    private matSnackBar: MatSnackBar
  ) {
    this.initializeForm(this.user);
  }

  initializeForm(user: IUser) {
    this.userForm = this.formBuilder.group({
      id: [this.user.id],
      name: [user.name, [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
      last_name1: [user.last_name1, [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
      last_name2: [user.last_name2, [Validators.minLength(3), Validators.maxLength(255)]],
      birth_date: [user.birth_date],
      phone_number: [user.phone_number, [Validators.required]],
      dni: [user.dni, [Validators.required, Validators.minLength(9), Validators.maxLength(9), Validators.pattern('\\d{8}[a-zA-Z]')]],
      city: [user.city, [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
      postal_code: [user.postal_code, [Validators.required]],
      address: [user.address, [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
      email: [user.email, [Validators.required, Validators.email]],
      username: [user.username, [Validators.required, Validators.minLength(6), Validators.maxLength(15)]],
      tipo: [user.role, [Validators.required]],
    });
  }

  ngOnInit() {
    if (this.operation === 'EDIT') {
      this.userAjaxService.getUserById(this.id).subscribe({
        next: (data: IUser) => {
          this.user = data;
          this.initializeForm(this.user);
          console.log(this.user.birth_date);
        },
        error: (err: HttpErrorResponse) => {
          this.status = err;
          this.matSnackBar.open("Error al obtener los datos del usuario", 'Aceptar', { duration: 3000 });
        }
      })
    } else {
      this.initializeForm(this.user);
    }
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.userForm.controls[controlName].hasError(errorName);
  }

  onSubmit() {
    if (this.userForm.valid) {
      if (this.operation === 'NEW') {
        this.userAjaxService.createUser(this.userForm.value).subscribe({
          next: (data: IUser) => {
            this.user.id = data.id;
            this.initializeForm(this.user);
            this.matSnackBar.open("Usuario creado correctamente", 'Aceptar', { duration: 3000 });
            this.router.navigate(['/admin/user/plist']);
          },
          error: (err: HttpErrorResponse) => {
            this.status = err;
            this.matSnackBar.open("Error al crear el usuario", 'Aceptar', { duration: 3000 });
          }
        })
      } else {
        this.userAjaxService.updateUser(this.userForm.value).subscribe({
          next: (data: IUser) => {
            this.user = data;
            this.initializeForm(this.user);
            this.matSnackBar.open("Usuario actualizado correctamente", 'Aceptar', { duration: 3000 });
            this.router.navigate(['/admin', 'user', 'view', this.user.id]);
          },
          error: (err: HttpErrorResponse) => {
            this.status = err;
            this.matSnackBar.open("Error al actualizar el usuario", 'Aceptar', { duration: 3000 });
          }
        })
      }
    }
  }

}