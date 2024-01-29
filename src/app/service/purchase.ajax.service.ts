import { IPurchase, IPurchasePage, Pageable, Sort } from './../model/model.interfaces';
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { API_URL } from "src/environment/environment";

@Injectable({
  providedIn: 'root'
})
export class PurchaseAjaxService {

  private url = API_URL + '/purchase';

  constructor(private http: HttpClient) {
  }

  getPurchaseById(id: number): Observable<IPurchase> {
    return this.http.get<IPurchase>(this.url + '/' + id);
  }

  getPurchaseByUsuarioId(user_id: number, page: number, size: number, direction: string, sort: string): Observable<IPurchasePage> {
    return this.http.get<IPurchasePage>(this.url + '/user/' + user_id + '?page=' + page + '&size=' + size + '&sort=' + sort + ',' + direction);
  }

  getPagePurchases(page: number, size: number, sort: string, direction: string): Observable<IPurchasePage> {
    return this.http.get<IPurchasePage>(this.url + '?page=' + page + '&size=' + size + '&sort=' + sort + ',' + direction);
  }

  getPurchaseRandom(): Observable<IPurchase> {
    return this.http.get<IPurchase>(this.url + '/random');
  }

  makeSingleCartPurchase(user_id: number, cart_id: number): Observable<IPurchase> {
    return this.http.post<IPurchase>(this.url + '/makeSingleCartPurchase/' + user_id + '/' + cart_id, {});
  }

  makeAllCartPurchase(user_id: number): Observable<IPurchase> {
    return this.http.post<IPurchase>(this.url + '/makeAllCartPurchase/' + user_id, {});
  }

  generatePurchases(amount: number): Observable<number> {
    return this.http.post<number>(this.url + '/populate/' + amount, {});
  }

  deletePurchase(id: number | undefined): Observable<number> {
    return this.http.delete<number>(this.url + '/' + id);
  }

  deleteAllPurchases(): Observable<number> {
    return this.http.delete<number>(this.url + '/empty');
  }

  findPurchasesByNewest(page: number, size: number, sort: string, direction: string): Observable<IPurchasePage> {
    return this.http.get<IPurchasePage>(this.url + '/findPurchasesByNewest?page=' + page + '&size=' + size + '&sort=' + sort + ',' + direction);
  }

  findPurchasesByOldest(page: number, size: number, sort: string, direction: string): Observable<IPurchasePage> {
    return this.http.get<IPurchasePage>(this.url + '/findPurchasesByOldest?page=' + page + '&size=' + size + '&sort=' + sort + ',' + direction);
  }

  findPurchasesMostExpensiveByIdUser(user_id: number, page: number, size: number, sort: string, direction: string): Observable<IPurchasePage> {
    return this.http.get<IPurchasePage>(this.url + '/findPurchasesMostExpensiveByIdUser/' + user_id + '?page=' + page + '&size=' + size + '&sort=' + sort + ',' + direction);
  }

  findPurchasesMostCheapestByIdUser(user_id: number, page: number, size: number, sort: string, direction: string): Observable<IPurchasePage> {
    return this.http.get<IPurchasePage>(this.url + '/findPurchasesMostCheapestByIdUser/' + user_id + '?page=' + page + '&size=' + size + '&sort=' + sort + ',' + direction);
  }

}