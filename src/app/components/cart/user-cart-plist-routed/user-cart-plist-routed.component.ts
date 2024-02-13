import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-user-cart-plist-routed',
  templateUrl: './user-cart-plist-routed.component.html',
  styleUrls: ['./user-cart-plist-routed.component.css']
})
export class UserCartPlistRoutedComponent implements OnInit {

  forceReload: Subject<boolean> = new Subject<boolean>();

  constructor() { }

  ngOnInit() {
  }

}
