import { Component, OnInit } from '@angular/core';
import { logOut } from '../auth/auth.component';
import { pb } from 'src/main';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  logOut = logOut
  messages :Messages[] = [];

  ngOnInit(): void {
    this.fetchMessages(1);
    

    
  }

  async fetchMessages(start : number) : Promise<any>{
    // fetch a paginated records list
    let response = await pb.collection('messages').getList(start, 50, {
      sort: 'created',
      expand: 'user',
    });
    
    console.log(response.items);

    response.items.forEach(res => {
      console.log(res);
      this.messages.push(new Messages(res));
    })

    console.log(this.messages);
  }
}

class Messages{
  author : any;
  message : string;

  constructor(entity:any){
    this.message = entity.field;
    this.author = {
      name : entity.expand.user.name,
    }
  }
}