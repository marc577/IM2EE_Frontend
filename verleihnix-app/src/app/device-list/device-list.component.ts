import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { DataService, BorrowDevice } from 'src/app/services/data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-device-list',
  templateUrl: './device-list.component.html',
  styleUrls: ['./device-list.component.css']
})
export class DeviceListComponent implements OnInit {

  devices:[BorrowDevice];
  subBorrowData: Subscription;

  searchValue:string;
  dateFrom:FormControl;
  minDateFrom:Date;
  dateTo:FormControl;
  minDateTo:Date;

  constructor(private router: Router, private aRoute: ActivatedRoute, private service:DataService) {

    this.subBorrowData = this.service.borrowData.subscribe((data) => {
      this.devices = data;
    });
    this.minDateFrom = new Date();
    this.dateFrom = new FormControl(this.minDateFrom);
    this.minDateTo = this.dateFrom.value;
    this.dateFrom.valueChanges.subscribe((val)=>{
      this.minDateTo = val;
    });
    this.dateTo = new FormControl(new Date());
  }

  ngOnInit() {
  }

  ngOnDestroy(){
    this.subBorrowData.unsubscribe();
  }
  search(){
    if(this.searchValue != undefined){
      console.log("Suche", this.searchValue);
    }
  }
  goToDetail(deviceId:number){
    this.router.navigate(["../device", deviceId], {relativeTo:this.aRoute});
  }

}
