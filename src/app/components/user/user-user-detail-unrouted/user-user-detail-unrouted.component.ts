import { Component, Input, OnInit, Optional } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IUser } from 'src/app/model/model.interfaces';
import { UserAjaxService } from 'src/app/service/user.ajax.service';
import { SessionAjaxService } from 'src/app/service/session.ajax.service';
import { ActivatedRoute, Router } from '@angular/router';

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
    private router: Router,
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
      },
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

  goBack(): void {
    if (this.user.role) {
      this.router.navigate(['/admin/user/plist']);
    } else {
      this.router.navigate(['/home']);
    }
  }
}