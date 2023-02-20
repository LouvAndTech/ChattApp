import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { pb } from 'src/main';

@Component({
  selector: 'app-new-message',
  templateUrl: './new-message.component.html',
  styleUrls: ['./new-message.component.scss']
})
export class NewMessageComponent implements OnInit {
  //Get the input field
  @ViewChild('message') inputMessage !: ElementRef;

  ngOnInit(): void {
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
