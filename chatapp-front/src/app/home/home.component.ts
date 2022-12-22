import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { pb } from 'src/main';

const messageperpage = 6;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  messages :Messages[] = [];
  @ViewChild('messageContainer') messageContainer !: ElementRef;
  @ViewChild('message') inputMessage !: ElementRef;

  //On init fetch the messages
  ngOnInit(): void {
    this.fetchMessages(1);
    this.subscibe();
    this.bottomMessage();
  }

  //Scroll to the last message in the list
  private bottomMessage(){
    try {
      this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
    } catch(err) {
      console.log(err);
    }  
  }

  /*
  Work only on new message and not on load
  And stop at the n-1 message
  ngAfterViewInit() {
    this.bottomMessage();
  }*/

  //Fetch the last 10 messages
  private async fetchMessages(start : number) : Promise<any>{
    // fetch a paginated records list
    let response = await pb.collection('messages').getList(start, messageperpage, {
      sort: '-created',
      expand: 'user',
    });
    
    response.items.reverse().forEach(res => {
      this.messages.push(new Messages(res));
    })
  }

  //subscribe to the fil of messages
  private subscibe(){
    pb.collection('messages').subscribe('*', e => {
      this.updateFil(e)
    });
  }

  //When the user scroll to the top of the list fetch the next 10 messages
  onScroll(){
    //when on top of the list
    if (this.messageContainer.nativeElement.scrollTop == 0){
      this.loadMore();
    }
  }

  async loadMore(){
    //fetch the next 10 messages
    try{
      var response = await pb.collection('messages').getList(1, messageperpage, {
        filter: 'created < "' + this.messages[0].date + '"',
        sort: '-created',
        expand: 'user',
      });
      //add the messages to the list at the top
      response.items.forEach(res => {
        this.messages.unshift(new Messages(res));
      })
    }catch(e){
      console.log(e);
    }
  }

  //NewMessage arrive 
  private async updateFil(e : any){
    e.record.expand.user = await pb.collection('users').getOne(e.record.user, {});
    this.messages.push(new Messages(e.record));
    await this.bottomMessage();
  }
  
  //Send a new message
  async sendMessage(message : string){
    //Empty the field
    this.inputMessage.nativeElement.value = null;
    //create a new message in the db
    if(pb.authStore.model)
      await pb.collection('messages').create({
        "field": message,
        "user": pb.authStore.model.id,
      });
  }

}

class Messages{
  date : string;
  author : any;
  message : string;

  constructor(entity:any){
    this.date = entity.created;
    this.message = entity.field;
    this.author = {
      name : entity.expand.user.name,
    }
  }
}