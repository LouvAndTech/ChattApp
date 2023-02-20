import { Component, OnInit , EventEmitter, Output} from '@angular/core';
import { logOut } from '../../auth/auth.component';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  opened: boolean = false;
  logOut = logOut;
  @Output() switchPage = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }

  openMenu() {
    this.opened = !this.opened;
  }
  setState(state: string) {
    this.switchPage.emit(state);
  }

}
