import { Component} from '@angular/core';
import { Router } from '@angular/router';
import { pb } from 'src/main'

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent{
  response = {
    state : false,
    message : "none",
    exist : false,
  };
  loading : boolean = false;
  
  constructor(private router : Router) { }

  async login(username : string ,pass : string) {
    this.loading = true;
    this.response.exist = false;
    try {
      await pb.collection('users').authWithPassword(username,pass);
      this.response = generateResponse(true);
      this.router.navigate(['/home']);
      
    } catch (error) {
      this.response = generateResponse(false);
    }

    this.loading = false;
  }

  async singup(username : string ,pass : string) {
    this.loading = true;
    this.response.exist = false;
    try{
      await pb.collection('users').create({
        "username": username,
        "name":username,
        "password": pass,
        "passwordConfirm": pass,
      });
      this.response = generateResponse(true, false);
    }catch (error){
      this.response = generateResponse(false, false);
    }
    this.loading = false
  }
}

function generateResponse(state : boolean , log : boolean = true) : any{
  return {
    state : (state) ? "succes" : "error",
    message : (state) ? (log)? "You're loged in" : "You're signed in" : (log)? "Error while login": "Error while Signing in",
    exist : true,
  };
}