import { Injectable } from "@angular/core";
import { API_URL } from "src/environment/environment";
import { IRating, IRatingPage } from "../model/model.interfaces";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class RatingAjaxService {

  private url = API_URL + '/rating';

  constructor(private http: HttpClient) {

  }

  getRatingById(id: number): Observable<IRating> {
    return this.http.get<IRating>(this.url + '/' + id);
  }

  getRatingRandom(): Observable<IRating> {
    return this.http.get<IRating>(this.url + '/random');
  }

  createRating(rating: IRating): Observable<IRating> {
    return this.http.post<IRating>(this.url, rating);
  }

  updateRating(rating: IRating): Observable<IRating> {
    return this.http.put<IRating>(this.url, rating);
  }

  deleteRating(id: number | undefined): Observable<number> {
    return this.http.delete<number>(this.url + '/' + id);
  }

  getRatingPage(page: number, size: number, sort: string, direction: string): Observable<IRatingPage> {
    return this.http.get<IRatingPage>(this.url + '?page=' + page + '&size=' + size + '&sort=' + sort + ',' + direction);
  }

  generateRatinges(amount: number): Observable<number> {
    return this.http.post<number>(this.url + '/populate/' + amount, {});
  }

  deleteAllRatinges(): Observable<number> {
    return this.http.delete<number>(this.url);
  }

  getRatingPageByProduct(product_id: number, page: number, size: number, sort: string, direction: string): Observable<IRatingPage> {
    return this.http.get<IRatingPage>(this.url + '/product/' + product_id + '?page=' + page + '&size=' + size + '&sort=' + sort + ',' + direction);
  }

  getRatingPageByUser(user_id: number, page: number, size: number, sort: string, direction: string): Observable<IRatingPage> {
    return this.http.get<IRatingPage>(this.url + '/user/' + user_id + '?page=' + page + '&size=' + size + '&sort=' + sort + ',' + direction);
  }

  getRatingByUserAndProduct(usuario_id: number, camiseta_id: number): Observable<IRating> {
    return this.http.get<IRating>(this.url + '/user/' + usuario_id + '/product/' + camiseta_id);
  }

  getAverageRatingByProduct(product_id: number): Observable<number> {
    return this.http.get<number>(this.url + '/product/' + product_id + '/average');
  }

  // Get ratings sorted by lowest punctuation for a product
  getRatingesByProductLowestPunctuation(product_id: number, page: number, size: number, sort: string, direction: string): Observable<IRatingPage> {
    return this.http.get<IRatingPage>(this.url + '/product/' + product_id + '/lowestPunctuation?page=' + page + '&size=' + size + '&sort=' + sort + ',' + direction);
  }

  // Get ratings sorted by highest punctuation for a product
  getRatingesByProductHighestPunctuation(product_id: number, page: number, size: number, sort: string, direction: string): Observable<IRatingPage> {
    return this.http.get<IRatingPage>(this.url + '/product/' + product_id + '/highestPunctuation?page=' + page + '&size=' + size + '&sort=' + sort + ',' + direction);
  }

  // Get ratings sorted by oldest for a product
  getRatingesByProductOldest(product_id: number, page: number, size: number, sort: string, direction: string): Observable<IRatingPage> {
    return this.http.get<IRatingPage>(this.url + '/product/' + product_id + '/oldest?page=' + page + '&size=' + size + '&sort=' + sort + ',' + direction);
  }

  // Get ratings sorted by newest for a product
  getRatingesByProductNewest(product_id: number, page: number, size: number, sort: string, direction: string): Observable<IRatingPage> {
    return this.http.get<IRatingPage>(this.url + '/product/' + product_id + '/newest?page=' + page + '&size=' + size + '&sort=' + sort + ',' + direction);
  }

  // Get ratings sorted by lowest punctuation for a user
  getRatingesByUserLowestPunctuation(user_id: number, page: number, size: number, sort: string, direction: string): Observable<IRatingPage> {
    return this.http.get<IRatingPage>(this.url + '/user/' + user_id + '/lowestPunctuation?page=' + page + '&size=' + size + '&sort=' + sort + ',' + direction);
  }

  // Get ratings sorted by highest punctuation for a user
  getRatingesByUserHighestPunctuation(user_id: number, page: number, size: number, sort: string, direction: string): Observable<IRatingPage> {
    return this.http.get<IRatingPage>(this.url + '/user/' + user_id + '/highestPunctuation?page=' + page + '&size=' + size + '&sort=' + sort + ',' + direction);
  }

  // Get ratings sorted by oldest for a user
  getRatingesByUserOldest(user_id: number, page: number, size: number, sort: string, direction: string): Observable<IRatingPage> {
    return this.http.get<IRatingPage>(this.url + '/user/' + user_id + '/oldest?page=' + page + '&size=' + size + '&sort=' + sort + ',' + direction);
  }

  // Get ratings sorted by newest for a user
  getRatingesByUserNewest(user_id: number, page: number, size: number, sort: string, direction: string): Observable<IRatingPage> {
    return this.http.get<IRatingPage>(this.url + '/user/' + user_id + '/newest?page=' + page + '&size=' + size + '&sort=' + sort + ',' + direction);
  }

}