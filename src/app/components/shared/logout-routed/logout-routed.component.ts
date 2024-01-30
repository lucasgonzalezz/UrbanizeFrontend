import { Component, OnInit } from '@angular/core';
import { SessionAjaxService } from 'src/app/service/session.ajax.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout-routed',
  templateUrl: './logout-routed.component.html',
  styleUrls: ['./logout-routed.component.css']
})
export class LogoutRoutedComponent implements OnInit {

  constructor(
    private sessionAjaxService: SessionAjaxService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  logout() {
    this.sessionAjaxService.logout();
    this.sessionAjaxService.emit({ type: 'logout' });
    this.router.navigate(['/home']);
  }

  cancel() {
    this.router.navigate(['/home']);
  }



}