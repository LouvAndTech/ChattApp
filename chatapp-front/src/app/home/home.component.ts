import { Component, OnInit } from '@angular/core';
import { pb } from 'src/main';

const messageperpage = 6;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  state: String = "mainThread";

  ngOnInit(): void {
      
  }

  changepage(state: string) {
    this.state = state;
  }
}

