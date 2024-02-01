import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admin-category-view-routed',
  templateUrl: './admin-category-view-routed.component.html',
  styleUrls: ['./admin-category-view-routed.component.css']
})
export class AdminCategoryViewRoutedComponent implements OnInit {

  id: number = 1;

  constructor(
    private activatedRoute: ActivatedRoute
  ) { 
    this.id = parseInt(this.activatedRoute.snapshot.paramMap.get('id') || "1");
  }

  ngOnInit() {
  }

}
