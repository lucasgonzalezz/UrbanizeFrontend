import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-user-purchase-plist-routed',
  templateUrl: './user-purchase-plist-routed.component.html',
  styleUrls: ['./user-purchase-plist-routed.component.css']
})
export class UserPurchasePlistRoutedComponent implements OnInit {

  forceReload: Subject<boolean> = new Subject<boolean>();
  user_id: number;

  constructor(
    private activatedRoute: ActivatedRoute
  ) { 
    this.user_id = parseInt(this.activatedRoute.snapshot.paramMap.get("user_id") || "0");
  }

  ngOnInit() {
  }
}
