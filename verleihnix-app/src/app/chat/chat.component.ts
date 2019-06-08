import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { DataService, Message } from '../services/data.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewChecked {

  private subChat: Subscription;
  private sub:Subscription;

  @ViewChild('scrollMe') private myScrollContainer: ElementRef;

  message = new FormControl('', [Validators.required]);
  messages:Message[];

  constructor(private service:DataService, private aRoute: ActivatedRoute) {
    this.sub = this.aRoute.params.subscribe(params => {
      const partner = +params['partner'];
      this.subChat = this.service.getChatData(partner).subscribe((data)=>{
        this.messages = data;
      });
    });
  }
  
  ngOnInit() { 
    this.scrollToBottom();
  }

  ngAfterViewChecked() {        
      this.scrollToBottom();        
  }

  ngOnDestroy(){
    this.sub.unsubscribe();
    this.subChat.unsubscribe();
  }
  scrollToBottom(): void {
    try {
        this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch(err) { }                 
  }

  send(){
    if(this.message.invalid) return;
    console.log("Send", this.message.value);
  }

}
