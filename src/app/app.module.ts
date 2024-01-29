import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClientModule } from '@angular/common/http';

import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// Services
import { UserAjaxService } from './service/user.ajax.service';
import { ProductAjaxService } from './service/product.ajax.service';
import { PurchaseAjaxService } from './service/purchase.ajax.service';
import { PurchaseDetailAjaxService } from './service/purchaseDetail.ajax.service';
import { CartAjaxService } from './service/cart.ajax.service';
import { RatingAjaxService } from './service/rating.ajax.service';
import { CategoryAjaxService } from './service/category.ajax.service';
import { MediaService } from './service/media.service';
import { SessionAjaxService } from './service/session.ajax.service';
import { CryptoService } from './service/crypto.service';

// Interceptor
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptor/auth.interceptor';

// Shared components
import { MenuUnroutedComponent } from './components/shared/menu-unrouted/menu-unrouted.component';
import { FooterUnroutedComponent } from './components/shared/footer-unrouted/footer-unrouted.component';
import { HomeRoutedComponent } from './components/shared/home-routed/home-routed.component';
import { LoginRoutedComponent } from './components/shared/login-routed/login-routed.component';
import { LogoutRoutedComponent } from './components/shared/logout-routed/logout-routed.component';

@NgModule({
  declarations: [
    AppComponent,
    // Shared components
    MenuUnroutedComponent,
    FooterUnroutedComponent,
    HomeRoutedComponent,
    LoginRoutedComponent,
    LogoutRoutedComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    CommonModule,
    ReactiveFormsModule, 
  ],
  providers: [
    UserAjaxService,
    ProductAjaxService,
    PurchaseAjaxService,
    PurchaseDetailAjaxService,
    CartAjaxService,
    RatingAjaxService,
    CategoryAjaxService,
    MediaService,
    SessionAjaxService,
    CryptoService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }