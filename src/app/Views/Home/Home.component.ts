import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-Home',
  templateUrl: './Home.component.html',
  styleUrls: ['./Home.component.css']
})
export class HomeComponent implements OnInit {
  loc!: string;
  // now!: Date;
  // time!: Observable<string>;
  // greeting: Promise<string>|null = null;
  // arrived: boolean = false;
  // private resolve: Function|null = null;

  constructor(private route: ActivatedRoute) { 
    // setInterval(() => {
    //   this.now = new Date();
    // }, 1);

    // this.reset();
    this.loc = this.route.snapshot.params['loc'];
  }

  // reset() {
  //   this.arrived = false;
  //   this.greeting = new Promise<string>((resolve, reject) => {
  //     this.resolve = resolve;
  //   });
  // }

  // clicked() {
  //   if (this.arrived) {
  //     this.reset();
  //   } else {
  //     this.resolve!('hi there!');
  //     this.arrived = true;
  //   }
  // }

  ngOnInit() {
    // this.time = new Observable<string>((observer: Observer<string>) => {
    //   setInterval(() => observer.next(new Date().toString()), 1000);
    // });
  }
}
