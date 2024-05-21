import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IPrelogin } from 'src/app/model/model.interfaces';
import { CryptoService } from 'src/app/service/crypto.service';
import { SessionAjaxService } from 'src/app/service/session.ajax.service';

@Component({
  selector: 'app-login-routed',
  templateUrl: './login-routed.component.html',
  styleUrls: ['./login-routed.component.css']
})
export class LoginRoutedComponent implements OnInit {

  loginForm: FormGroup;
  status: HttpErrorResponse | null = null;
  prelogin: IPrelogin | null = null;
  notificationMessage: string | null = null;
  showNotification = false;

  constructor(
    private fb: FormBuilder,
    private sessionService: SessionAjaxService,
    private router: Router,
    private cryptoService: CryptoService
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      contrasenya: ['', [Validators.required]],
      captcha: ['', [Validators.required]]
    });
  }

  getPreloginData() {
    this.sessionService.prelogin().subscribe({
      next: (data: IPrelogin) => {
        this.prelogin = data;
      },
      error: (error) => {
        this.status = error;
        this.showNotificationWithMessage('Error al obtener los datos de prelogin');
      }
    });
  }

  ngOnInit() {
    this.getPreloginData();
  }

  onSubmit() {
    if (this.loginForm.valid && this.prelogin) {
      let username = this.loginForm.get('username')?.value;
      let contrasenya = this.loginForm.get('contrasenya')?.value;
      let contrasenyaSHA256 = this.cryptoService.getSHA256(contrasenya);
      let token = this.prelogin.token;
      let answer = this.loginForm.get('captcha')?.value;
      this.sessionService.loginCaptcha(username, contrasenyaSHA256, token, answer).subscribe({
        next: (data: string) => {
          this.sessionService.setToken(data);
          this.sessionService.emit({ type: 'login' });
          this.sessionService.getSessionUser().subscribe({
            next: (user) => {
              if (user.role) {
                this.router.navigate(['/admin/user/plist']);
              } else {
                this.router.navigate(['/home']);
              }
            },
            error: (error: HttpErrorResponse) => {
              this.status = error;
              this.showNotificationWithMessage('Error al obtener la sesión del usuario');
              this.router.navigate(['/home']);
            }
          });
        },
        error: (error: HttpErrorResponse) => {
          this.status = error;
          this.showNotificationWithMessage('Error al iniciar sesión');
          this.getPreloginData();
          this.loginForm.reset();
        }
      });
    }
  }

  onReset() {
    this.loginForm.reset();
    this.getPreloginData();
  }

  loginAdmin() {
    this.loginForm.setValue({ username: 'pepe33', contrasenya: 'urbanize', captcha: '' });
  }

  loginUser() {
    this.loginForm.setValue({ username: 'pepita', contrasenya: 'urbanize', captcha: '' });
  }

  showNotificationWithMessage(message: string) {
    this.notificationMessage = message;
    this.showNotification = true;
    setTimeout(() => {
      this.notificationMessage = null;
      this.showNotification = false;
    }, 2000);
  }
}
