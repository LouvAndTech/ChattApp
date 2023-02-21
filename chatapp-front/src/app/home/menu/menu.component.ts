import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {pb} from 'src/main'


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {


  constructor(private router :Router) { }

  ngOnInit(): void {
  }

  logout(){
    pb.authStore.clear();
    this.router.navigate(['/login']);
  }

}
