import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { API_URL } from "src/environment/environment";

@Injectable({
  providedIn: 'root'
})
export class MediaService {

  private url = API_URL + '/media';

  constructor(private http: HttpClient) {
  }

  uploadFile(formData: FormData): Observable<any> {
    return this.http.post(this.url + '/upload', formData);
  }

}