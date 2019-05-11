import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { DataService, DevicePool } from 'src/app/services/data.service';
import { Subscription } from 'rxjs';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';


interface DialogData {
  name: string;
  desc: string;
}

@Component({
  selector: 'app-pools',
  templateUrl: './pools.component.html',
  styleUrls: ['./pools.component.css']
})
export class PoolsComponent implements OnInit, OnDestroy {

  subPoolData:Subscription;
  devicePools:[DevicePool];

  constructor(
    private router: Router,
    private aRoute: ActivatedRoute, 
    private service:DataService,
    private dialog: MatDialog
    ) {
    
    this.subPoolData = this.service.devicesData.subscribe((data) => {
      this.devicePools = data;
    });

  }

  ngOnInit() {
  }
  ngOnDestroy(){
    this.subPoolData.unsubscribe();
  }

  goToEdit(poolId:number, deviceId:number){
    this.router.navigate(["../device-edit", poolId, deviceId], {relativeTo:this.aRoute});
  }


  addPool(){
    const dialogRef = this.dialog.open(AddPoolDialog, {
      width: '300px',
      data: {name: "", desc:""}
    });

    dialogRef.afterClosed().subscribe(comment => {
      console.log('The dialog was closed', comment);
    });
  }
}

@Component({
  selector: 'dialog-add-pool',
  templateUrl: 'add-pool.dialog.html',
})
export class AddPoolDialog {

  constructor(
    public dialogRef: MatDialogRef<AddPoolDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}
