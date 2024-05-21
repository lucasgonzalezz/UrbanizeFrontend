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

  getPurchaseByUsuarioId(user_id: number, size: number, page: number, sort: string, direction: string): Observable<IPurchasePage> {
    return this.http.get<IPurchasePage>(this.url + '/byUser/' + user_id + "?size=" + size + "&page=" + page + '&sort=' + sort + ',' + direction);
  }

  getPagePurchases(size: number | undefined, page: number | undefined, orderField: string, orderDirection: string, user_id: number): Observable<IPurchasePage> {
    let userParam = "";
    if (user_id > 0) {
        userParam = '&user=' + user_id;
    }
    const url = `${this.url}?size=${size}&page=${page}&sort=${orderField},${orderDirection}${userParam}`;
    return this.http.get<IPurchasePage>(url);
}


  getPurchaseRandom(): Observable<IPurchase> {
    return this.http.get<IPurchase>(this.url + '/random');
  }

  makeProductPurhase(product_id: number, user_id: number, amount: number): Observable<IPurchase> {
    return this.http.post<IPurchase>(this.url + '/makeProductPurhase/' + product_id + '/' + user_id + '/' + amount, {});
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