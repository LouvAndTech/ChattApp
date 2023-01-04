import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import PocketBase from 'pocketbase';

//IMPORTANT TO CHANGE BEFORE DEPLOYMENT
//export const pb = new PocketBase('http://localhost:8090');
export const pb = new PocketBase('https://chat.elouan-lerissel.fr');

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));