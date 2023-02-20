import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';
import { HomeComponent } from './home/home.component';
import { MsgThreadComponent } from './home/main-thread/msg-thread/msg-thread.component';
import { NewMessageComponent } from './home/main-thread/new-message/new-message.component';
import { MenuComponent } from './home/menu/menu.component';
import { AboutComponent } from './about/about.component';
import { MainThreadComponent } from './home/main-thread/main-thread.component';
import { ProfileComponent } from './home/profile/profile.component';

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    HomeComponent,
    MsgThreadComponent,
    NewMessageComponent,
    MenuComponent,
    AboutComponent,
    MainThreadComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
