import { NgModule, LOCALE_ID } from '@angular/core';
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
import { DialogService } from 'primeng/dynamicdialog';
import { NgxPaginationModule } from 'ngx-pagination';
import { ConfirmationService } from 'primeng/api';

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
import { PurchaseDetailPrintService } from './service/purchaseDetail.print.service';
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
import { RegisterRoutedComponent } from './components/shared/register-routed/register-routed.component';
// User components
import { AdminUserFormUnroutedComponent } from './components/user/admin-user-form-unrouted/admin-user-form-unrouted.component';
import { AdminUserPlistRoutedComponent } from './components/user/admin-user-plist-routed/admin-user-plist-routed.component';
import { AdminUserPlistUnroutedComponent } from './components/user/admin-user-plist-unrouted/admin-user-plist-unrouted.component';
import { AdminUserDetailUnroutedComponent } from './components/user/admin-user-detail-unrouted/admin-user-detail-unrouted.component';
import { AdminUserNewRoutedComponent } from './components/user/admin-user-new-routed/admin-user-new-routed.component';
import { AdminUserEditRoutedComponent } from './components/user/admin-user-edit-routed/admin-user-edit-routed.component';
import { AdminUserSelectionUnroutedComponent } from './components/user/admin-user-selection-unrouted/admin-user-selection-unrouted.component';
import { AdminUserViewRoutedComponent } from './components/user/admin-user-view-routed/admin-user-view-routed.component'; 
import { UserUserDetailUnroutedComponent } from './components/user/user-user-detail-unrouted/user-user-detail-unrouted.component';
import { UserUserViewRoutedComponent } from './components/user/user-user-view-routed/user-user-view-routed.component';
import { UserUserFormUnroutedComponent } from './components/user/user-user-form-unrouted/user-user-form-unrouted.component';
import { UserUserEditRoutedComponent } from './components/user/user-user-edit-routed/user-user-edit-routed.component';
// Product components
import { AdminProductPlistRoutedComponent } from './components/product/admin-product-plist-routed/admin-product-plist-routed.component';
import { AdminProductPlistUnroutedComponent } from './components/product/admin-product-plist-unrouted/admin-product-plist-unrouted.component';
import { AdminProductFormUnroutedComponent } from './components/product/admin-product-form-unrouted/admin-product-form-unrouted.component';
import { AdminProductEditRoutedComponent } from './components/product/admin-product-edit-routed/admin-product-edit-routed.component';
import { AdminProductNewRoutedComponent } from './components/product/admin-product-new-routed/admin-product-new-routed.component';
import { AdminProductSelectionUnroutedComponent } from './components/product/admin-product-selection-unrouted/admin-product-selection-unrouted.component';
import { AdminProductDetailUnroutedComponent } from './components/product/admin-product-detail-unrouted/admin-product-detail-unrouted.component';
import { AdminProductViewRoutedComponent } from './components/product/admin-product-view-routed/admin-product-view-routed.component';
import { UserProductPlistUnroutedComponent } from './components/product/user-product-plist-unrouted/user-product-plist-unrouted.component';
import { UserProductDetailUnroutedComponent } from './components/product/user-product-detail-unrouted/user-product-detail-unrouted.component';
import { UserProductViewRoutedComponent } from './components/product/user-product-view-routed/user-product-view-routed.component';
import { UserProductRatingFormUnroutedComponent } from './components/product/user-product-rating-form-unrouted/user-product-rating-form-unrouted.component';
// Category components
import { AdminCategoryPlistRoutedComponent } from './components/category/admin-category-plist-routed/admin-category-plist-routed.component';
import { AdminCategoryPlistUnroutedComponent } from './components/category/admin-category-plist-unrouted/admin-category-plist-unrouted.component';
import { AdminCategorySelectionUnroutedComponent } from './components/category/admin-category-selection-unrouted/admin-category-selection-unrouted.component';
import { AdminCategoryDetailUnroutedComponent } from './components/category/admin-category-detail-unrouted/admin-category-detail-unrouted.component';
import { AdminCategoryFormUnroutedComponent } from './components/category/admin-category-form-unrouted/admin-category-form-unrouted.component';
import { AdminCategoryNewRoutedComponent } from './components/category/admin-category-new-routed/admin-category-new-routed.component';
import { AdminCategoryEditRoutedComponent } from './components/category/admin-category-edit-routed/admin-category-edit-routed.component';
import { AdminCategoryViewRoutedComponent } from './components/category/admin-category-view-routed/admin-category-view-routed.component';
// Rating components
import { AdminRatingPlistRoutedComponent } from './components/rating/admin-rating-plist-routed/admin-rating-plist-routed.component';
import { AdminRatingPlistUnroutedComponent } from './components/rating/admin-rating-plist-unrouted/admin-rating-plist-unrouted.component';
import { AdminRatingDetailUnroutedComponent } from './components/rating/admin-rating-detail-unrouted/admin-rating-detail-unrouted.component';
import { AdminRatingFormUnroutedComponent } from './components/rating/admin-rating-form-unrouted/admin-rating-form-unrouted.component';
import { AdminRatingEditRoutedComponent } from './components/rating/admin-rating-edit-routed/admin-rating-edit-routed.component';
import { AdminRatingViewRoutedComponent } from './components/rating/admin-rating-view-routed/admin-rating-view-routed.component';
import { UserRatingPlistUnroutedComponent } from './components/rating/user-rating-plist-unrouted/user-rating-plist-unrouted.component';
// Purchase components
import { UserPurchasePlistUnroutedComponent } from './components/purchase/user-purchase-plist-unrouted/user-purchase-plist-unrouted.component';
import { UserPurchasePlistRoutedComponent } from './components/purchase/user-purchase-plist-routed/user-purchase-plist-routed.component';
import { UserPurchaseDetailUnroutedComponent } from './components/purchase/user-purchase-detail-unrouted/user-purchase-detail-unrouted.component';
import { UserPurchaseViewRoutedComponent } from './components/purchase/user-purchase-view-routed/user-purchase-view-routed.component';
// PurchaseDetail components
import { UserPurchaseDetailPlistUnroutedComponent } from './components/purchaseDetail/user-purchaseDetail-plist-unrouted/user-purchaseDetail-plist-unrouted.component';
// Cart components
import { UserCartPlistUnroutedComponent } from './components/cart/user-cart-plist-unrouted/user-cart-plist-unrouted.component';
import { UserCartPlistRoutedComponent } from './components/cart/user-cart-plist-routed/user-cart-plist-routed.component';

import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
registerLocaleData(localeEs);

@NgModule({
  declarations: [
    AppComponent,
    // Shared components
    MenuUnroutedComponent,
    FooterUnroutedComponent,
    HomeRoutedComponent,
    LoginRoutedComponent,
    LogoutRoutedComponent,
    RegisterRoutedComponent,
    // User components
    AdminUserFormUnroutedComponent,
    AdminUserPlistRoutedComponent,
    AdminUserPlistUnroutedComponent,
    AdminUserDetailUnroutedComponent,
    AdminUserNewRoutedComponent,
    AdminUserEditRoutedComponent,
    AdminUserSelectionUnroutedComponent,
    AdminUserViewRoutedComponent,
    UserUserDetailUnroutedComponent,
    UserUserViewRoutedComponent,
    UserUserFormUnroutedComponent,
    UserUserEditRoutedComponent,
    // Product components
    AdminProductPlistRoutedComponent,
    AdminProductPlistUnroutedComponent,
    AdminProductFormUnroutedComponent,
    AdminProductEditRoutedComponent,
    AdminProductNewRoutedComponent,
    AdminProductSelectionUnroutedComponent,
    AdminCategoryPlistUnroutedComponent,
    AdminProductDetailUnroutedComponent,
    AdminProductViewRoutedComponent,
    UserProductPlistUnroutedComponent,
    UserProductDetailUnroutedComponent,
    UserProductViewRoutedComponent,
    UserProductRatingFormUnroutedComponent,
    // Category components
    AdminCategoryPlistUnroutedComponent,
    AdminCategoryPlistRoutedComponent,
    AdminCategorySelectionUnroutedComponent,
    AdminCategoryFormUnroutedComponent,
    AdminCategoryDetailUnroutedComponent,
    AdminCategoryNewRoutedComponent,
    AdminCategoryEditRoutedComponent,
    AdminCategoryViewRoutedComponent,
    // Rating components
    AdminRatingPlistRoutedComponent,
    AdminRatingPlistUnroutedComponent,
    AdminRatingDetailUnroutedComponent,
    AdminRatingFormUnroutedComponent,
    AdminRatingEditRoutedComponent,
    AdminRatingViewRoutedComponent,
    UserRatingPlistUnroutedComponent,
    // Purchase components
    UserPurchasePlistUnroutedComponent,
    UserPurchasePlistRoutedComponent,
    UserPurchaseDetailUnroutedComponent,
    UserPurchaseViewRoutedComponent,
    // PurchaseDetail components
    UserPurchaseDetailPlistUnroutedComponent,
    // Cart components
    UserCartPlistUnroutedComponent,
    UserCartPlistRoutedComponent,
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
    ConfirmPopupModule,
    NgxPaginationModule,
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
    DialogService,
    ConfirmationService,
    PurchaseDetailPrintService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    // Proporcionar el identificador de localización para 'es-ES'
    { provide: LOCALE_ID, useValue: 'es-ES' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }