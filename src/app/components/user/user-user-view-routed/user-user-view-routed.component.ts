import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-user-view-routed',
  templateUrl: './user-user-view-routed.component.html',
  styleUrls: ['./user-user-view-routed.component.css']
})
export class UserUserViewRoutedComponent implements OnInit {

  id: number = 1;

  constructor(
    private activatedRoute: ActivatedRoute
  ) { 
    this.id = parseInt(this.activatedRoute.snapshot.paramMap.get('id') || "1");
  }

  ngOnInit() {
  }


}
