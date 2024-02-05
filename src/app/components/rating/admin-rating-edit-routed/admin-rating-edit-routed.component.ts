import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admin-rating-edit-routed',
  templateUrl: './admin-rating-edit-routed.component.html',
  styleUrls: ['./admin-rating-edit-routed.component.css']
})
export class AdminRatingEditRoutedComponent implements OnInit {

  id: number = 1;

  constructor(
    private activatedRoute: ActivatedRoute
  ) { 
    this.id = parseInt(this.activatedRoute.snapshot.paramMap.get('id') || '1');
  }

  ngOnInit() {
  }

}
