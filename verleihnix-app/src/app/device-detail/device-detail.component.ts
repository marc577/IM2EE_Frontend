import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { Insertion, DataService, Product, NewRequest } from 'src/app/services/data.service';
import { Subscription } from 'rxjs';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar} from '@angular/material';
import { DatePipe } from '@angular/common';

interface DialogData {
  comment: string;
}


@Component({
  selector: 'app-device-detail',
  templateUrl: './device-detail.component.html',
  styleUrls: ['./device-detail.component.css'],
  providers:[DatePipe]
})
export class DeviceDetailComponent implements OnInit, OnDestroy {

  dateFrom:FormControl;
  minDateFrom:Date;
  dateTo:FormControl;
  minDateTo:Date;
  product:Product;
  filtered:Insertion[];
  days = 1;
  private subProduct:Subscription;
  private id:number;
  private sub:Subscription;


  constructor(private datePipe: DatePipe, private router: Router, private aRoute: ActivatedRoute, private service:DataService, private dialog: MatDialog, private snackBar: MatSnackBar) {
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

  load(){
    this.sub = this.aRoute.params.subscribe(params => {
      this.id = +params['id'];
      this.subProduct = this.service.getProduct(this.id).subscribe((p)=>{
        this.product = p;
        this.filter();
      });
    });
  }
  
  ngOnInit() {
    this.load();
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

      var diff = Math.abs(to - from);
      this.days = Math.ceil(diff / (1000 * 3600 * 24)) + 1;
      var requests = element.insertionRequests;
      //console.log(requests);
      if(!requests) return false;
      for (let index = 0; index < requests.length; index++) {
        const el = requests[index];
        if(el.state == "declined"){continue;}
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
    // console.log(from);
    // console.log(elFrom);
    // console.log(to);
    // console.log(elTo);
    if(from <= elFrom && to >= elTo) return false;
    if(elFrom <= from && elTo >= to) return false;
    if(elTo > from && elTo < to) return false;
    if(elFrom > from && elFrom < to) return false;
    return true;
  }

  request(d:Insertion){
    var msg = "Ich möchte gerne Ihr Produkt gerne vom " + this.datePipe.transform(this.dateFrom.value)+ " bis zum ";
    msg += this.datePipe.transform(this.dateTo.value) + " ausleihen!";
    const dialogRef = this.dialog.open(DialogNewRequestDialog, {
      width: '300px',
      data: {comment: msg}
    });

    dialogRef.afterClosed().subscribe(comment => {
      if(comment){
        //Anfrgae erstellen
        const data:NewRequest = {
          message:comment,
          dateTo:this.dateTo.value,
          dateFrom:this.dateFrom.value,
          insertionId: d.id
        }
        this.service.requestInsertion(data).subscribe((val)=>{
          this.load();
          this.snackBar.open("Anfrage versendet!", "OK", {
            duration: 2000,
            verticalPosition:"top"
          });
        }, (er)=> {
          this.service.catchError(er);
        });
      }
    });
  }

}


@Component({
  selector: 'dialog-new-request',
  templateUrl: 'dialog-new-request.html',
  styles:[".mat-form-field { width: 100%; }"]
})
export class DialogNewRequestDialog {

  constructor(
    public dialogRef: MatDialogRef<DialogNewRequestDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}

