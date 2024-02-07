import { Component, OnInit } from '@angular/core';
import { SessionAjaxService } from './../../../service/session.ajax.service';
import { UserAjaxService } from 'src/app/service/user.ajax.service';
import { IUser } from 'src/app/model/model.interfaces';
import { NavigationEnd, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-home-routed',
  templateUrl: './home-routed.component.html',
  styleUrls: ['./home-routed.component.css']
})
export class HomeRoutedComponent implements OnInit {

  username: string = '';
  userSession: IUser | null = null;
  url: string = '';


  constructor(
    private oRouter: Router,
    private sessionService: SessionAjaxService,
    private userAjaxService: UserAjaxService,
  ) {
    console.log('MenuUnroutedComponent created'); // Agrega este log al constructor

    this.oRouter.events.subscribe((ev) => {
      if (ev instanceof NavigationEnd) {
        this.url = ev.url;
      }
    })

    this.username = sessionService.getUsername();
    this.userAjaxService.getUserByUsername(this.sessionService.getUsername()).subscribe({
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
  }

}
