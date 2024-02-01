import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeRoutedComponent } from './components/shared/home-routed/home-routed.component';
import { LoginRoutedComponent } from './components/shared/login-routed/login-routed.component';
import { LogoutRoutedComponent } from './components/shared/logout-routed/logout-routed.component';

import { AdminUserPlistRoutedComponent } from './components/user/admin-user-plist-routed/admin-user-plist-routed.component';
import { AdminUserEditRoutedComponent } from './components/user/admin-user-edit-routed/admin-user-edit-routed.component';
import { AdminUserNewRoutedComponent } from './components/user/admin-user-new-routed/admin-user-new-routed.component';
import { AdminProductPlistRoutedComponent } from './components/product/admin-product-plist-routed/admin-product-plist-routed.component';

const routes: Routes = [
  { path: '', component: HomeRoutedComponent },
  { path: 'home', component: HomeRoutedComponent },
  { path: 'login', component: LoginRoutedComponent },
  { path: 'logout', component: LogoutRoutedComponent },

  { path: 'admin/user/plist', component: AdminUserPlistRoutedComponent},
  { path: 'admin/user/edit/:id', component: AdminUserEditRoutedComponent},
  { path: 'admin/user/new', component: AdminUserNewRoutedComponent},

  { path: 'admin/product/plist', component: AdminProductPlistRoutedComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }