import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { API_URL } from "src/environment/environment";
import { ICart, ICartPage } from "../model/model.interfaces";

@Injectable({
  providedIn: 'root'
})
export class CartAjaxService {

  private url = API_URL + '/api/cart';

  constructor(private http: HttpClient) {
  }

  getCartById(id: number): Observable<ICart> {
    return this.http.get<ICart>(this.url + '/' + id);
  }

  getCartsByUser(user_id: number, size: number, page: number, sort: string, direction: string): Observable<ICartPage> {
    return this.http.get<ICartPage>(this.url + '/byUser/' + user_id + '?size=' + size + '&page=' + page + '&sort=' + sort + ',' + direction);
}

  getCartByUserAndProduct(user_id: number, product_id: number): Observable<ICart> {
    return this.http.get<ICart>(this.url + '/user/' + user_id + '/product/' + product_id);
  }

  getPageCarts(page: number, size: number, sort: string, direction: string): Observable<ICartPage> {
    return this.http.get<ICartPage>(this.url + '?page=' + page + '&size=' + size + '&sort=' + sort + ',' + direction);
  }

  getCartCost(id: number): Observable<number> {
    return this.http.get<number>(this.url + '/cost/' + id);
  }

  getTotalCartCost(user_id: number): Observable<number> {
    return this.http.get<number>(this.url + '/totalCost/' + user_id);
  }

  createCart(cart: ICart): Observable<ICart> {
    return this.http.post<ICart>(this.url, cart);
  }

  generateCarts(amount: number): Observable<number> {
    return this.http.post<number>(this.url + '/populate/' + amount, {});
  }

  updateCart(cart: ICart): Observable<ICart> {
    return this.http.put<ICart>(this.url, cart);
  }

  deleteCart(id: number | undefined): Observable<number> {
    return this.http.delete<number>(this.url + '/' + id);
  }

  deleteCartByUsuario(user_id: number): Observable<number> {
    return this.http.delete<number>(this.url + '/user/' + user_id);
  }

  deleteAllCarts(): Observable<number> {
    return this.http.delete<number>(this.url + '/empty');
  }

}