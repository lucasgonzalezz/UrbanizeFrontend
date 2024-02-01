import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admin-product-edit-routed',
  templateUrl: './admin-product-edit-routed.component.html',
  styleUrls: ['./admin-product-edit-routed.component.css']
})
export class AdminProductEditRoutedComponent implements OnInit {

  id: number = 1;

  constructor(
    private activatedRoute: ActivatedRoute
  ) { 
    this.id = parseInt(this.activatedRoute.snapshot.paramMap.get('id') || '1');
  }

  ngOnInit() {
  }
}
