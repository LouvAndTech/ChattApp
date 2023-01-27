import { Component, OnInit } from '@angular/core';
import { logOut } from '../../auth/auth.component';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  logOut = logOut;

  constructor() { }

  ngOnInit(): void {
  }

}
