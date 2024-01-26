import { HttpHeaders } from "@angular/common/http";

export const API_URL: string = 'http://localhost:8081';

export const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json'
    })
};