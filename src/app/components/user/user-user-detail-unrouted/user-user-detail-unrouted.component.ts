import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit, Optional } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IUser } from 'src/app/model/model.interfaces';
import { UserAjaxService } from 'src/app/service/user.ajax.service';
import { SessionAjaxService } from 'src/app/service/session.ajax.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-user-user-detail-unrouted',
  templateUrl: './user-user-detail-unrouted.component.html',
  styleUrls: ['./user-user-detail-unrouted.component.css']
})
export class UserUserDetailUnroutedComponent implements OnInit {

  @Input() id: number = 1;

  user: IUser = {} as IUser;
  status: HttpErrorResponse | null = null;
  userSession: IUser | null = null;


  constructor(
    private sessionAjaxService: SessionAjaxService,
    private userAjaxService: UserAjaxService,
    @Optional() public ref: DynamicDialogRef,
    @Optional() public config: DynamicDialogConfig
  ) {
    if (config) {
      if (config.data) {
        this.id = config.data.id;
      }
    }

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
    this.getOne();
  }

  getOne(): void {
    this.userAjaxService.getUserById(this.id).subscribe({
      next: (data: IUser) => {
        this.user = data;
      },
      error: (err: HttpErrorResponse) => {
        this.status = err;
      }
    });
    }

}
