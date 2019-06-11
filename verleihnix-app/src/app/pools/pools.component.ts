import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { DataService, Pool, Insertion } from 'src/app/services/data.service';
import { Subscription } from 'rxjs';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';


interface DialogData {
  description: string;
  id:number
}

@Component({
  selector: 'app-pools',
  templateUrl: './pools.component.html',
  styleUrls: ['./pools.component.css']
})
export class PoolsComponent implements OnInit, OnDestroy {

  subPoolData:Subscription;
  devicePools:Pool[];
  expandedPool:number;

  constructor(
    private router: Router,
    private aRoute: ActivatedRoute, 
    private service:DataService,
    private dialog: MatDialog
    ) {
      this.subPoolData = this.service.devicesData.subscribe((data) => {
        this.devicePools = data;
        this.expandedPool = this.service.expandedPool;
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
  deleteDevice(p:Insertion){
    if(confirm("Gerät "+p.title+" wirklich löschen?")){
      this.service.deleteInsertion(p.id);
    }
  }


  addPool(){
    const dialogRef = this.dialog.open(AddPoolDialog, {
      width: '300px',
      data: {id:-1, description:""}
    });

    dialogRef.afterClosed().subscribe( pool => {
      this.service.editPool(pool);
    });
  }
  editPool(p:Insertion){
    const dialogRef = this.dialog.open(AddPoolDialog, {
      width: '300px',
      data: {id:p.id, description:p.description}
    });

    dialogRef.afterClosed().subscribe( pool => {
      this.service.editPool(pool);
    });
  }
  deletePool(p:Insertion){
    if(confirm("Gerätepool "+p.description+" wirklich löschen?")){
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
  styles:[".mat-form-field { width: 100%; }"]
})
export class AddPoolDialog {

  constructor(
    public dialogRef: MatDialogRef<AddPoolDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}
