import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { IUser, SessionEvent } from 'src/app/model/model.interfaces';
import { SessionAjaxService } from 'src/app/service/session.ajax.service';
import { UserAjaxService } from 'src/app/service/user.ajax.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-menu-unrouted',
  templateUrl: './menu-unrouted.component.html',
  styleUrls: ['./menu-unrouted.component.css']
})
export class MenuUnroutedComponent implements OnInit {

  username: string = '';
  userSession: IUser | null = null;
  url: string = '';

  public mostrarDropdown = false;

    
  constructor(
    private elRef: ElementRef,
    private sessionAjaxService: SessionAjaxService,
    private userAjaxService: UserAjaxService,
    private router: Router,
    private route: ActivatedRoute
  ) {

    this.router.events.subscribe((ev) => {
      if (ev instanceof NavigationEnd) {
        this.url = ev.url;
      }
    })

    this.username = sessionAjaxService.getUsername();
    this.userAjaxService.getUserByUsername(this.sessionAjaxService.getUsername()).subscribe({
      next: (user: IUser) => {
        this.userSession = user;
        console.log('User Session:', this.userSession); // Agrega este log
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
      }
    });
  }

  ngOnInit() {
    this.sessionAjaxService.on().subscribe({
      next: (data: SessionEvent) => {
        console.log('Received session event:', data); // Agrega este log
        
        if (data.type === 'login') {
          this.username = this.sessionAjaxService.getUsername();
          this.userAjaxService.getUserByUsername(this.sessionAjaxService.getUsername()).subscribe({
            next: (user: IUser) => {
              this.userSession = user;
              console.log('User Session:', this.userSession); // Agrega este log
            },
            error: (err: HttpErrorResponse) => {
              console.log(err);
            }
          });
        } else if (data.type === 'logout') {
          this.username = '';
          this.userSession = null; // Asegúrate de establecer userSession a null en caso de cierre de sesión
          console.log('User Session after logout:', this.userSession); // Agrega este log
        }
      }
    });
  }

  toggleDropdown() {
    this.mostrarDropdown = !this.mostrarDropdown;
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    if (!this.elRef.nativeElement.contains(event.target)) {
      this.mostrarDropdown = false;
    }

}
}
