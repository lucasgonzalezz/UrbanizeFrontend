import { Component, OnInit } from '@angular/core';
import { IUser, SessionEvent } from 'src/app/model/model.interfaces';
import { SessionAjaxService } from 'src/app/service/session.ajax.service';
import { UserAjaxService } from 'src/app/service/user.ajax.service';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-admin-user-view-routed',
  templateUrl: './admin-user-view-routed.component.html',
  styleUrls: ['./admin-user-view-routed.component.css']
})
export class AdminUserViewRoutedComponent implements OnInit {

  id: number = 1;

  username: string = '';
  userSession: IUser | null = null;

  constructor(
    private activatedRoute: ActivatedRoute,
    private sessionAjaxService: SessionAjaxService,
    private userAjaxService: UserAjaxService,
  ) { 
    this.id = parseInt(this.activatedRoute.snapshot.paramMap.get('id') || "1");

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
  }

}
