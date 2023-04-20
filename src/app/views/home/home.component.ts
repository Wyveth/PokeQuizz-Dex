import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  loc!: string;

  constructor(private route: ActivatedRoute) { 
    this.loc = this.route.snapshot.params['loc'];
  }

  ngOnInit() {
  }
}
