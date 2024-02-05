import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admin-rating-view-routed',
  templateUrl: './admin-rating-view-routed.component.html',
  styleUrls: ['./admin-rating-view-routed.component.css']
})
export class AdminRatingViewRoutedComponent implements OnInit {

  id: number = 1;

  constructor(
    private activatedRoute: ActivatedRoute
  ) { 
    this.id = parseInt(this.activatedRoute.snapshot.paramMap.get('id') || "1");
  }

  ngOnInit() {
  }

}
