import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { API_URL } from "src/environment/environment";
import { IUser, IUserPage } from "../model/model.interfaces";

@Injectable({
  providedIn: 'root'
})
export class UserAjaxService {

  url: string = API_URL + '/user';

  constructor(private http: HttpClient) {
  }

  getUserById(id: number): Observable<IUser> {
    return this.http.get<IUser>(this.url + '/' + id);
  }

  getUserByUsername(username: string): Observable<IUser> {
    return this.http.get<IUser>(this.url + '/username/' + username);
  }

  getUserRandom(): Observable<IUser> {
    return this.http.get<IUser>(this.url + '/random');
  }

  createUser(user: IUser): Observable<IUser> {
    return this.http.post<IUser>(this.url, user);
  }

  updateUser(user: IUser): Observable<IUser> {
    return this.http.put<IUser>(this.url, user);
  }

  deleteUser(id: number | undefined): Observable<number> {
    return this.http.delete<number>(this.url + '/' + id);
  }

  getUserPage(page: number, size: number, sort: string, direction: string): Observable<IUserPage> {
    return this.http.get<IUserPage>(this.url + '?page=' + page + '&size=' + size + '&sort=' + sort + ',' + direction);
  }

  generateUsers(amount: number): Observable<number> {
    return this.http.post<number>(this.url + '/populate/' + amount, {});
  }

  deleteAllUsers(): Observable<number> {
    return this.http.delete<number>(this.url + '/empty');
  }

  getUsersWithMostPurchases(page: number, size: number): Observable<IUserPage> {
    return this.http.get<IUserPage>(this.url + '/mostPurchases?page=' + page + '&size=' + size);
  }

  getUsersWithFewestPurchases(page: number, size: number): Observable<IUserPage> {
    return this.http.get<IUserPage>(this.url + '/fewestPurchases?page=' + page + '&size=' + size);
  }

  getUsersWithMostRatings(page: number, size: number): Observable<IUserPage> {
    return this.http.get<IUserPage>(this.url + '/mostRatings?page=' + page + '&size=' + size);
  }

}