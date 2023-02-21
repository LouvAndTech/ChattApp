import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import {pb} from 'src/main'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'ChatApp - LouvAndTech';

  pb = pb

  constructor(private router: Router) {

    this.router.events.subscribe((event) => this.onRouteChange(event));
  }

  ngOnInit(){
    pb.authStore.clear();
    console.log(window.location.href);
    console.log("Hello from Angular app.component.ts");
  }

  onRouteChange(event: any) {
      if (event instanceof NavigationEnd) { //If the user try to change route
        if(event.url != '/login'){ //If the route isn't the login page
          if (!pb.authStore.isValid) { //If the user isn't logged in
            this.router.navigate(['/login']); //Redirect to login page
          }
        }
      }
    }

}

