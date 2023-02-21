import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: 'login', component: AuthComponent },
  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // default route redirect to log in page
  { path: '**', redirectTo:'/login', pathMatch: 'full' } // 404 route redirect to log in page
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 

  
}
