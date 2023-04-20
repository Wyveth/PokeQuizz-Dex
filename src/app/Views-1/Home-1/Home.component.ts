import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-Home',
  templateUrl: './Home.component.html',
  styleUrls: ['./Home.component.scss']
})
export class HomeComponent implements OnInit {
  loc!: string;

  constructor(private route: ActivatedRoute) { 
    this.loc = this.route.snapshot.params['loc'];
  }

  ngOnInit() {
  }
}
