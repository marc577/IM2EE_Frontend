import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { Device, DataService, BorrowDevice } from 'src/app/services/data.service';
import { Subscription } from 'rxjs';
import { DateAdapter } from '@angular/material/core';


@Component({
  selector: 'app-device-detail',
  templateUrl: './device-detail.component.html',
  styleUrls: ['./device-detail.component.css']
})
export class DeviceDetailComponent implements OnInit, OnDestroy {

  dateFrom:FormControl;
  minDateFrom:Date;
  dateTo:FormControl;
  minDateTo:Date;
  count:Number;
  countFormControl:FormControl;
  device:Device;
  private id:number;
  private sub:Subscription;


  constructor(private router: Router, private aRoute: ActivatedRoute, private service:DataService) {
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
    this.sub = this.aRoute.params.subscribe(params => {
      this.id = +params['id']; // (+) converts string 'id' to a number
      this.device = this.service.getDevice(this.id);
      this.countFormControl = new FormControl(1, [Validators.min(1),Validators.max(10)]);
    });
  }
  ngOnDestroy(){
    this.sub.unsubscribe();
  }

  dateFilter(d: Date) {
    const day = d.getDay();
    // Prevent Saturday and Sunday from being selected.
    return day !== 0 && day !== 6;
  }

}
