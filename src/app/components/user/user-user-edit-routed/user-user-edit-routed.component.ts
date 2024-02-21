import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-user-edit-routed',
  templateUrl: './user-user-edit-routed.component.html',
  styleUrls: ['./user-user-edit-routed.component.css']
})
export class UserUserEditRoutedComponent implements OnInit {

  id: number = 1;

  constructor(
    private activatedRoute: ActivatedRoute
  ) { 
    this.id = parseInt(this.activatedRoute.snapshot.paramMap.get('id') || '1');
  }

  ngOnInit() {
  }

}
