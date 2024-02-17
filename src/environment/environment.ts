import { HttpHeaders } from "@angular/common/http";

export const API_URL: string = 'http://pro.ausiasmarch.es:50548';

export const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json'
    })
};