import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { API_URL } from "src/environment/environment";
import { IProduct, IProductPage } from "../model/model.interfaces";

@Injectable({
  providedIn: 'root'
})
export class ProductAjaxService {

  private url = API_URL + '/product';

  constructor(private http: HttpClient) {
  }

  getProductById(id: number): Observable<IProduct> {
    return this.http.get<IProduct>(this.url + '/' + id);
  }

  getPageProducts(page: number, size: number, sort: string, direction: string): Observable<IProductPage> {
    return this.http.get<IProductPage>(this.url + '?page=' + page + '&size=' + size + '&sort=' + sort + ',' + direction);
  }

  getProductRandom(): Observable<IProduct> {
    return this.http.get<IProduct>(this.url + '/random');
  }

  getProductsByCategory(category_id: number, page: number, size: number, sort: string, direction: string): Observable<IProductPage> {
    return this.http.get<IProductPage>(this.url + '/category/' + category_id + '?page=' + page + '&size=' + size + '&sort=' + sort + ',' + direction);
  }

  getProductsBySize(size: number, page: number, size2: number, sort: string, direction: string): Observable<IProductPage> {
    return this.http.get<IProductPage>(this.url + '/size/' + size + '?page=' + page + '&size=' + size2 + '&sort=' + sort + ',' + direction);
  }

  getProductsMostSold(page: number, size: number): Observable<IProductPage> {
    return this.http.get<IProductPage>(this.url + '/mostSold?page=' + page + '&size=' + size);
  }

  searchProducts(searchText: string, page: number, size: number, sort: string, direction: string): Observable<IProductPage> {
    return this.http.get<IProductPage>(this.url + '/search/' + searchText + '?page=' + page + '&size=' + size + '&sort=' + sort + ',' + direction);
  }

  // Get product by stock
  getProductsByStock(stock: number, page: number, size: number, sort: string, direction: string): Observable<IProductPage> {
    return this.http.get<IProductPage>(this.url + '/stock/' + stock + '?page=' + page + '&size=' + size + '&sort=' + sort + ',' + direction);
  }

  // Get products by price and category descending
  getProductsByPriceAndCategoryDesc(category_id: number, price: number, page: number, size: number, sort: string, direction: string): Observable<IProductPage> {
    return this.http.get<IProductPage>(this.url + '/category/' + category_id + '/price/' + price + '/desc?page=' + page + '&size=' + size + '&sort=' + sort + ',' + direction);
  }


  getProductPrice(id: number): Observable<number> {
    return this.http.get<number>(this.url + '/price/' + id);
  }

  createProduct(product: IProduct): Observable<IProduct> {
    return this.http.post<IProduct>(this.url, product);
  }

  generateProducts(amount: number): Observable<number> {
    return this.http.post<number>(this.url + '/populate/' + amount, {});
  }

  updateProduct(product: IProduct): Observable<IProduct> {
    return this.http.put<IProduct>(this.url, product);
  }

  deleteProduct(id: number | undefined): Observable<number> {
    return this.http.delete<number>(this.url + '/' + id);
  }

  deleteAllProducts(): Observable<number> {
    return this.http.delete<number>(this.url + '/empty');
  }
}