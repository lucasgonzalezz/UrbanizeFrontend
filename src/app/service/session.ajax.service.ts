import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { API_URL } from "src/environment/environment";
import { UserAjaxService } from "./user.ajax.service";
import { IPrelogin, IToken, IUser, SessionEvent } from "../model/model.interfaces";
import { Observable, Subject } from "rxjs";
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SessionAjaxService {

  private url = API_URL + '/session';
  subjectSession = new Subject<SessionEvent>();
  private userSession: IUser | null = null;

  constructor(private http: HttpClient, private userAjaxService: UserAjaxService) { }

  private parseJwt(token: string): IToken {
    var base64url = token.split('.')[1];
    var base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  }
  
  prelogin(): Observable<IPrelogin> {
    return this.http.get<IPrelogin>(this.url + '/prelogin');
  }

  loginCaptcha(username: string, password: string, token: string, answer: string): Observable<any> {
    return this.http.post(this.url + '/loginCaptcha', { username: username, password: password, token: token, answer: answer }, { responseType: 'text' });
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post(this.url + '/login', { username: username, password: password }, { responseType: 'text' });
  }

  setToken(token: string): void {
    localStorage.setItem('token', token);
    this.loadUserSession();
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
    this.userSession = null;
  }

  register(user: IUser): Observable<IUser> {
    return this.http.post<IUser>(this.url + '/register', user);
}

  isSessionActive(): boolean {
    let token: string | null = localStorage.getItem('token');
    if (token) {
      let decodedToken: IToken = this.parseJwt(token);
      if (Date.now() >= decodedToken.exp * 1000) {
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  }

  getUsername(): string {
    if (this.isSessionActive()) {
      let token: string | null = localStorage.getItem('token');
      if (!token) {
        return '';
      } else {
        return this.parseJwt(token).name;
      }
    } else {
      return '';
    }
  }

  on(): Observable<SessionEvent> {
    return this.subjectSession.asObservable();
  }

  emit(event: SessionEvent): void {
    this.subjectSession.next(event);
  }

  getSessionUser(): Observable<IUser> {
    return this.userAjaxService.getUserByUsername(this.getUsername()).pipe(
      tap(user => this.userSession = user)
    );
  }

  private loadUserSession(): void {
    if (this.isSessionActive()) {
      this.getSessionUser().subscribe(user => {
        this.userSession = user;
      });
    }
  }

  getUserSession(): IUser | null {
    return this.userSession;
  }
}
