import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UserAjaxService } from 'src/app/service/user.ajax.service';

@Component({
  selector: 'app-register-routed',
  templateUrl: './register-routed.component.html',
  styleUrls: ['./register-routed.component.css']
})
export class RegisterRoutedComponent implements OnInit {

  userForm!: FormGroup;
  isSubmitting = false;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserAjaxService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.userForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
      last_name1: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]], // Agregar validadores requeridos aquí
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    });
  }
  

  hasError(controlName: string, errorName: string): boolean {
    return this.userForm.controls[controlName].hasError(errorName);
  }

  onSubmit(): void {
    console.log('Formulario enviado');
    console.log('Datos del formulario:', this.userForm.value);
    if (this.userForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      const userData = this.userForm.value;
      delete userData.confirmPassword;
      this.userService.createUser(userData).subscribe(
        () => {
          this.snackBar.open('Usuario registrado correctamente', 'Aceptar', { duration: 3000 });
          this.router.navigate(['/login']); // Redirigir al usuario a la página de inicio de sesión
        },
        error => {
          this.snackBar.open('Error al registrar usuario', 'Aceptar', { duration: 3000 });
          this.isSubmitting = false;
        }
      );
    }
  }

}
