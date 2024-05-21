import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admin-purchase-plist-routed',
  templateUrl: './admin-purchase-plist-routed.component.html',
  styleUrls: ['./admin-purchase-plist-routed.component.css']
})
export class AdminPurchasePlistRoutedComponent implements OnInit {

  forceReload: Subject<boolean> = new Subject<boolean>();
  user_id: number;

  constructor(
    private ActivatedRoute: ActivatedRoute,
  ) { 
    this.user_id = parseInt(this.ActivatedRoute.snapshot.paramMap.get('user_id') || '0');
  }

  ngOnInit() {
  }

}
