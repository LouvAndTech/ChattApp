import { Component, OnInit } from '@angular/core';
import {pb} from 'src/main'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ChatApp - LouvAndTech';

  pb = pb

  ngOnInit(){
    pb.authStore.clear();
    console.log(window.location.href);
  }

}

