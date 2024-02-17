import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { API_URL } from "src/environment/environment";
import { IPurchaseDetail, IPurchaseDetailPage } from "../model/model.interfaces";

@Injectable({
  providedIn: 'root'
})
export class PurchaseDetailAjaxService {

  private url = API_URL + '/api/purchaseDetail';

  constructor(private http: HttpClient) {

  }

  getPurchaseDetailById(id: number): Observable<IPurchaseDetail> {
    return this.http.get<IPurchaseDetail>(this.url + '/' + id);
  }

  // Get purchase details by order ID
  getPurchaseDetailByOrderId(id: number): Observable<IPurchaseDetail[]> {
    return this.http.get<IPurchaseDetail[]>(this.url + '/byPurchase/purchase_id' + id);
  }

  // Get purchase details by product ID
  getPurchaseDetailByProductId(id: number): Observable<IPurchaseDetail[]> {
    return this.http.get<IPurchaseDetail[]>(this.url + '/byProduct/product_id' + id);
  }

  // Get purchase details by purchase ID and product ID
  getPurchaseDetailByPurchaseIdAndProductId(purchase_id: number, product_id: number): Observable<IPurchaseDetail[]> {
    return this.http.get<IPurchaseDetail[]>(this.url + '/byPurchase/purchase_id' + purchase_id + '/byProduct/product_id' + product_id);
  }

  // Get a random purchase detail
  getRandomPurchaseDetail(): Observable<IPurchaseDetail> {
    return this.http.get<IPurchaseDetail>(this.url + '/random');
  }

  getPurchaseDetailPage(page: number, size: number, sort: string, direction: string, purchase_id: number, product_id: number): Observable<IPurchaseDetailPage> {
    return this.http.get<IPurchaseDetailPage>(this.url + '?page=' + page + '&size=' + size + '&sort=' + sort + ',' + direction + '&purchase_id=' + purchase_id + '&product_id=' + product_id);
  }

  getPurchaseDetailByCompraId(purchase_id: number, size: number, page: number, sort: string, direction: string): Observable<IPurchaseDetailPage> {
    return this.http.get<IPurchaseDetailPage>(this.url + '/byPurchase/' + purchase_id + '?size=' + size + '&page=' + page + '&sort=' + sort + ',' + direction);
  }

  updatePurchaseDetail(purchaseDetail: IPurchaseDetail): Observable<IPurchaseDetail> {
    return this.http.put<IPurchaseDetail>(this.url, purchaseDetail);
  }

  deletePurchaseDetail(id: number | undefined): Observable<number> {
    return this.http.delete<number>(this.url + '/' + id);
  }

  // Empty the purchase detail table
  deleteAllPurchaseDetails(): Observable<number> {
    return this.http.delete<number>(this.url + '/empty');
  }

  // Get purchase details ordered by price in descending purchase
  getPurchaseDetailByPriceDesc(): Observable<IPurchaseDetail[]> {
    return this.http.get<IPurchaseDetail[]>(this.url + '/byPriceDesc');
  }

  // Get purchase details ordered by price in ascending purchase
  getPurchaseDetailByPriceAsc(): Observable<IPurchaseDetail[]> {
    return this.http.get<IPurchaseDetail[]>(this.url + '/byPriceAsc');
  }

}