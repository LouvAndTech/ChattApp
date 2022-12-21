import { Component, OnInit } from '@angular/core';
import { logOut } from '../auth/auth.component';
import {pb} from 'src/main'

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  logOut = logOut
  pb = pb
  constructor() { }

  ngOnInit(): void {
  }

}
