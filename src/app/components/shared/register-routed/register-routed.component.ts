import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CryptoService } from 'src/app/service/crypto.service';
import { IUser } from 'src/app/model/model.interfaces';
import { HttpErrorResponse } from '@angular/common/http';
import { SessionAjaxService } from 'src/app/service/session.ajax.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register-routed',
  templateUrl: './register-routed.component.html',
  styleUrls: ['./register-routed.component.css']
})
export class RegisterRoutedComponent implements OnInit {

  userForm!: FormGroup;
  isSubmitting = false;
  user: IUser = {} as IUser;
  status: HttpErrorResponse | null = null;

  constructor(
    private cryptoService: CryptoService,
    private formBuilder: FormBuilder,
    private sessionAjaxService: SessionAjaxService,
    private router: Router,
    private matSnackBar: MatSnackBar
  ) { }

  initForm(user: IUser): void {
    this.userForm = this.formBuilder.group({
      id: [user.id],
      name: [user.name, [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
      surname: [user.surname, [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
      username: [user.username, [Validators.required]],
      email: [user.email, [Validators.required, Validators.email]],
      password: [user.password, [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      birth_date: [user.birth_date, [Validators.required]],
      dni: [user.dni, [Validators.required, Validators.pattern(/^[0-9]{8}[A-Za-z]$/)]],
      address: [user.address, [Validators.required, Validators.minLength(5), Validators.maxLength(255)]]
    }, { 
      validator: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      formGroup.get('confirmPassword')?.setErrors({ mustMatch: true });
    } else {
      formGroup.get('confirmPassword')?.setErrors(null);
    }
  }

  ngOnInit(): void {
    this.initForm(this.user);
  }
  
  hasError(controlName: string, errorName: string): boolean {
    return this.userForm.controls[controlName].hasError(errorName);
  }

  isAdult(): boolean {
    if (this.userForm.get('birth_date')?.value) {
      const birth_date = new Date(this.userForm.get('birth_date')?.value);
      const today = new Date();
      const age = today.getFullYear() - birth_date.getFullYear();
      const monthDiff = today.getMonth() - birth_date.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth_date.getDate())) {
        return age - 1 >= 18;
      }
      return age >= 18;
    }
    return false;
  }

  onSubmit() {
    if (this.userForm.valid) {
      const encryptedPassword = this.cryptoService.getSHA256(this.userForm.get('password')?.value);
      this.userForm.patchValue({ password: encryptedPassword, confirmPassword: '' });
  
      this.sessionAjaxService.register(this.userForm.value).subscribe({
        next: (data: IUser) => {
          this.user = data;
          this.user.surname;
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Registro completado con éxito",
            timerProgressBar: true,
            timer: 1000,
          });
          this.router.navigate(['/login']);
        },
        error: (err: HttpErrorResponse) => {
          this.status = err;
          Swal.fire({
            position: "center",
            icon: "error",
            title: "Error al registrarte",
            text: "El username o el email ya están en uso",
            timerProgressBar: true,
            timer: 1500,
          });
          this.matSnackBar.open(`Ha habido un error al registrarte. Vuelve a intentarlo`, 'Aceptar', { duration: 3000 });
        }
      });
    }
  }
  
}
