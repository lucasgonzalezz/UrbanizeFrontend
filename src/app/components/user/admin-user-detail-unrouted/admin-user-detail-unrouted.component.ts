import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit, Optional } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IUser } from 'src/app/model/model.interfaces';
import { UserAjaxService } from 'src/app/service/user.ajax.service';

@Component({
  selector: 'app-admin-user-detail-unrouted',
  templateUrl: './admin-user-detail-unrouted.component.html',
  styleUrls: ['./admin-user-detail-unrouted.component.css']
})
export class AdminUserDetailUnroutedComponent implements OnInit {

  @Input() id: number = 1;

  user: IUser = {} as IUser;
  status: HttpErrorResponse | null = null;

  constructor(
    private userAjaxService: UserAjaxService,
    @Optional() public ref: DynamicDialogRef,
    @Optional() public config: DynamicDialogConfig
  ) {
    if (config) {
      if (config.data) {
        this.id = config.data.id;
      }
    }
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

