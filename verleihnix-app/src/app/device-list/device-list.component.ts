import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { DataService, Product } from 'src/app/services/data.service';
import { Subscription } from 'rxjs';
import { DateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-device-list',
  templateUrl: './device-list.component.html',
  styleUrls: ['./device-list.component.css']
})
export class DeviceListComponent implements OnInit {

  devices:Product[];
  subProductData: Subscription;

  searchValue:string;
  dateFrom:FormControl;
  minDateFrom:Date;
  dateTo:FormControl;
  minDateTo:Date;

  constructor(private router: Router, private aRoute: ActivatedRoute, private service:DataService) {

    this.subProductData = this.service.productData.subscribe((data) => {
      this.devices = data;
    });
    this.minDateFrom =  new Date();
    this.dateFrom = new FormControl(this.service.dateFrom);
    this.minDateTo = this.dateFrom.value;
    this.dateFrom.valueChanges.subscribe((val)=>{
      this.minDateTo = val;
      this.service.dateFrom = val;
    });
    this.dateTo = new FormControl(this.service.dateTo);
    this.dateTo.valueChanges.subscribe((val)=>{
      this.service.dateTo = val;
    });
  }

  ngOnInit() {
    this.searchValue = this.service.searchString;
  }

  ngOnDestroy(){
    this.subProductData.unsubscribe();
  }
  search(){
    this.service.searchString = this.searchValue;
    if(this.searchValue != undefined){
      //console.log("Suche", this.searchValue);
    }
  }
  goToDetail(deviceId:number){
    this.router.navigate(["../device", deviceId], {relativeTo:this.aRoute});
  }

}
