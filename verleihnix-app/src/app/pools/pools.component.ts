import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { DataService, DevicePool, Device } from 'src/app/services/data.service';
import { Subscription } from 'rxjs';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';


interface DialogData {
  title: string;
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
  expandedPool:number;

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
      this.expandedPool = this.service.expandedPool;
  }
  ngOnDestroy(){
    this.subPoolData.unsubscribe();
  }

  goToEdit(poolId:number, deviceId:number){
    this.router.navigate(["../device-edit", poolId, deviceId], {relativeTo:this.aRoute});
  }
  deleteDevice(p:Device){
    if(confirm("Gerät "+p.title+" wirklich löschen?")){
      this.service.deleteDevice(p);
    }
  }


  addPool(){
    const dialogRef = this.dialog.open(AddPoolDialog, {
      width: '300px',
      data: {id:-1, name: "", desc:""}
    });

    dialogRef.afterClosed().subscribe( pool=> {
      this.service.addPool(pool);
    });
  }
  editPool(p:DevicePool){
    const dialogRef = this.dialog.open(AddPoolDialog, {
      width: '300px',
      data: p
    });

    dialogRef.afterClosed().subscribe( pool => {
      this.service.editPool(pool);
    });
  }
  deletePool(p:DevicePool){
    if(confirm("Gerätepool "+p.name+" wirklich löschen?")){
      this.service.deletePool(p);
    }
  }

  setExpanded(i:number){
    this.service.expandedPool = i;
  }
  setClosed(i:number){
    if(this.service.expandedPool == i){
      this.service.expandedPool = -1;
    }
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
