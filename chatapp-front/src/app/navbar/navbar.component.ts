import { Component, OnInit } from '@angular/core';
import {pb} from 'src/main'

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  pb = pb
  constructor() { }

  ngOnInit(): void {
  }

}
