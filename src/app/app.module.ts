import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { PaginatorModule } from 'primeng/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ConfirmPopupModule } from 'primeng/confirmpopup';

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
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// User components
import { AdminUserFormUnroutedComponent } from './components/user/admin-user-form-unrouted/admin-user-form-unrouted.component';
import { AdminUserPlistRoutedComponent } from './components/user/admin-user-plist-routed/admin-user-plist-routed.component';
import { AdminUserPlistUnroutedComponent } from './components/user/admin-user-plist-unrouted/admin-user-plist-unrouted.component';
import { AdminUserDetailUnroutedComponent } from './components/user/admin-user-detail-unrouted/admin-user-detail-unrouted.component';
import { AdminUserNewRoutedComponent } from './components/user/admin-user-new-routed/admin-user-new-routed.component';
import { AdminUserEditRoutedComponent } from './components/user/admin-user-edit-routed/admin-user-edit-routed.component';
import { AdminUserSelectionUnroutedComponent } from './components/user/admin-user-selection-unrouted/admin-user-selection-unrouted.component';
// Product components
import { AdminProductPlistRoutedComponent } from './components/product/admin-product-plist-routed/admin-product-plist-routed.component';
import { AdminProductPlistUnroutedComponent } from './components/product/admin-product-plist-unrouted/admin-product-plist-unrouted.component';
import { AdminProductFormUnroutedComponent } from './components/product/admin-product-form-unrouted/admin-product-form-unrouted.component';
import { AdminProductEditRoutedComponent } from './components/product/admin-product-edit-routed/admin-product-edit-routed.component';
import { AdminProductNewRoutedComponent } from './components/product/admin-product-new-routed/admin-product-new-routed.component';
import { AdminProductSelectionUnroutedComponent } from './components/product/admin-product-selection-unrouted/admin-product-selection-unrouted.component';
import { AdminProductDetailUnroutedComponent } from './components/product/admin-product-detail-unrouted/admin-product-detail-unrouted.component';

// Category components
import { AdminCategoryPlistRoutedComponent } from './components/category/admin-category-plist-routed/admin-category-plist-routed.component';
import { AdminCategoryPlistUnroutedComponent } from './components/category/admin-category-plist-unrouted/admin-category-plist-unrouted.component';

@NgModule({
  declarations: [
    AppComponent,
    // Shared components
    MenuUnroutedComponent,
    FooterUnroutedComponent,
    HomeRoutedComponent,
    LoginRoutedComponent,
    LogoutRoutedComponent,
    // User components
    AdminUserFormUnroutedComponent,
    AdminUserPlistRoutedComponent,
    AdminUserPlistUnroutedComponent,
    AdminUserDetailUnroutedComponent,
    AdminUserNewRoutedComponent,
    AdminUserEditRoutedComponent,
    AdminUserSelectionUnroutedComponent,
    // Product components
    AdminProductPlistRoutedComponent,
    AdminProductPlistUnroutedComponent,
    AdminProductFormUnroutedComponent,
    AdminProductEditRoutedComponent,
    AdminProductNewRoutedComponent,
    AdminProductSelectionUnroutedComponent,
    AdminCategoryPlistUnroutedComponent,
    // Category components
    AdminCategoryPlistUnroutedComponent,
    AdminCategoryPlistRoutedComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    CommonModule,
    ReactiveFormsModule, 
    DynamicDialogModule,
    BrowserAnimationsModule,
    MatSnackBarModule,
    PaginatorModule,
    MatProgressSpinnerModule,
    ConfirmPopupModule
  ],
  providers: [
    // Services
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