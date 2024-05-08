import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IUser } from 'src/app/model/model.interfaces';
import { SessionAjaxService } from 'src/app/service/session.ajax.service';
import { UserAjaxService } from 'src/app/service/user.ajax.service';

@Component({
  selector: 'app-user-purchase-view-routed',
  templateUrl: './user-purchase-view-routed.component.html',
  styleUrls: ['./user-purchase-view-routed.component.css']
})
export class UserPurchaseViewRoutedComponent implements OnInit {

  id: number = 1;
  userSession: IUser | null = null;
  username: string = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private sessionAjaxService: SessionAjaxService,
    private userAjaxService: UserAjaxService,
  ) { 
    this.id = parseInt(this.activatedRoute.snapshot.paramMap.get('id') || "1" );

    this.username = sessionAjaxService.getUsername();
    this.userAjaxService.getUserByUsername(this.sessionAjaxService.getUsername()).subscribe({
      next: (user: IUser) => {
        this.userSession = user;
      },
      error: (err: HttpErrorResponse) => {
        console.log(err);
      }
    });
  }

  ngOnInit() {
  }
}