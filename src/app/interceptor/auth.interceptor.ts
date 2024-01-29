import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { SesionAjaxService } from "../service/session.ajax.service";
import { Observable } from "rxjs";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(
        private sesionService: SesionAjaxService,
    ) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (this.sesionService.isSessionActive()) {
            const token = this.sesionService.getToken();
            if (token) {
                const cloned = req.clone({
                    headers: req.headers.set("Authorization", "Bearer " + token)
                });
                return next.handle(cloned);
            }
            else {
                return next.handle(req);
            }
        } else {
            return next.handle(req);
        }
    }
}