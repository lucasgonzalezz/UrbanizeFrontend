import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-user-product-view-routed',
  templateUrl: './user-product-view-routed.component.html',
  styleUrls: ['./user-product-view-routed.component.css']
})
export class UserProductViewRoutedComponent implements OnInit {

  forceReload: Subject<boolean> = new Subject<boolean>();
  id: number = 1;

  constructor(
    private oActivatedRoute: ActivatedRoute
  ) {
    this.id = parseInt(this.oActivatedRoute.snapshot.paramMap.get("id") || "1");
  }

  ngOnInit() {
  }

}