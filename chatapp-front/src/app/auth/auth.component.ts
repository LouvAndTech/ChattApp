import { Component} from '@angular/core';
import { pb } from 'src/app/app.component';

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

  async login(username : string ,pass : string) {
    this.loading = true;
    this.response.exist = false;
    try {

      await pb.collection('users').authWithPassword(username,pass);
      
      // after the above you can also access the auth data from the authStore
      console.log(pb.authStore.isValid);
      console.log(pb.authStore.token);
      if (pb.authStore.model){
        console.log(pb.authStore.model.id);
      }
    this.response = generateResponse(true);

    } catch (error) {
      console.log("error",error);
      this.response = generateResponse(false);
    }

    this.loading = false;
  }

  singup(username : string ,pass : string) {
    console.log("singn up with : ",username,pass);
  }
}

function generateResponse(state : boolean) : any{
  return {
    state : (state) ? "succes" : "error",
    message : (state) ? "You're loged in" : "Error while login",
    exist : true,
  };
}
