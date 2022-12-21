import { Component } from '@angular/core';
import PocketBase from 'pocketbase';

export const pb = new PocketBase('http://127.0.0.1:8090');

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'chatapp-front';

  logedIn : boolean = pb.authStore.isValid;

}

