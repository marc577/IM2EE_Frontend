import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { Insertion, DataService, Product } from 'src/app/services/data.service';
import { Subscription } from 'rxjs';


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
  product:Product;
  filtered:Insertion[];
  private subProduct:Subscription;
  private id:number;
  private sub:Subscription;


  constructor(private router: Router, private aRoute: ActivatedRoute, private service:DataService) {
    this.minDateFrom =  new Date();
    this.dateFrom = new FormControl(this.service.dateFrom);
    this.minDateTo = this.dateFrom.value;
    this.filtered = [];
    this.dateFrom.valueChanges.subscribe((val)=>{
      this.minDateTo = val;
      this.service.dateFrom = val;
      this.filter();
    });
    this.dateTo = new FormControl(this.service.dateTo);
    this.dateTo.valueChanges.subscribe((val)=>{
      this.service.dateTo = val;
      this.filter();
    });
  }
  
  ngOnInit() {
    this.sub = this.aRoute.params.subscribe(params => {
      this.id = +params['id'];
      this.subProduct = this.service.getProduct(this.id).subscribe((p)=>{
        this.product = p;
        this.filter();
      });
    });

  }
  ngOnDestroy(){
    this.sub.unsubscribe();
    this.subProduct.unsubscribe();
  }

  dateFilter(d: Date) {
    return true;
  }
  filter(){
    this.filtered = this.product.insertions.filter((element:Insertion, index:number)=>{
      if(this.dateFrom.invalid || this.dateTo.invalid){
        return false;
      }
      const from = this.dateFrom.value.getTime();
      const to = this.dateTo.value.getTime();
      var requests = element.insertionStateCalendars;
      console.log(requests);
      if(!requests) return false;
      for (let index = 0; index < requests.length; index++) {
        const el = requests[index];
        const elFrom = el.dateFrom;
        const elTo = el.dateTo;
        var b = this._periodFilter(from, elFrom, to, elTo);
        if(b == false){
          return false;
        }
      }
      return true;
    });
  }
  private _periodFilter(from:number, elFrom:number, to:number, elTo:number):boolean{
    //TODO: Date Filter
    console.log(from);
    console.log(elFrom);
    console.log(to);
    console.log(elTo);
    if(from < elFrom && to > elTo) return false;
    if(elFrom < from && elTo > to) return false;
    if(elTo > from && elTo < to) return false;
    if(elFrom > from && elFrom < to) return false;
    return true;
  }

  request(d:Insertion){
    console.log("re", d);
  }

}
