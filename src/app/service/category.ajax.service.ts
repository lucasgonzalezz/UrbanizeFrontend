import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { API_URL } from "src/environment/environment";
import { ICategory, ICategoryPage } from "../model/model.interfaces";

@Injectable({
  providedIn: 'root'
})
export class CategoryAjaxService {

  private url = API_URL + '/category';

  constructor(private http: HttpClient) {
  }

  getCategorydById(id: number): Observable<ICategory> {
    return this.http.get<ICategory>(this.url + '/' + id);
  }

  getCategoryPage(size: number | undefined,  page: number | undefined,  sort: string, direction: string): Observable<ICategoryPage> {
    return this.http.get<ICategoryPage>(this.url + '?size=' + size + '&page=' + page +  + '&sort=' + sort + ',' + direction);
  }

  getCategorydRandom(): Observable<ICategory> {
    return this.http.get<ICategory>(this.url + '/random');
  }

  createCategory(category: ICategory): Observable<ICategory> {
    return this.http.post<ICategory>(this.url, category);
  }

  updateCategory(category: ICategory): Observable<ICategory> {
    return this.http.put<ICategory>(this.url, category);
  }

  deleteCategory(id: number | undefined): Observable<number> {
    return this.http.delete<number>(this.url + '/' + id);
  }

  generateCategories(amount: number): Observable<number> {
    return this.http.post<number>(this.url + '/populate/' + amount, {});
  }

  deleteAllCategoryes(): Observable<number> {
    return this.http.delete<number>(this.url + '/empty');
  }

  // Get category ordered by the quantity of associated products in descending order
  getCategorydByQuantity(): Observable<ICategory[]> {
    return this.http.get<ICategory[]>(this.url + '/quantityProduct');
  }

}