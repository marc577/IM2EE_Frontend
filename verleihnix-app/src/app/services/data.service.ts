import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';


export interface BorrowDevice {
  id: number,
  img: string,
  title: string
}
export interface Request {
  id: number,
  type:number,
  title: string,
  from:Date,
  to:Date
}
export interface Device {
  id:number,
  title: string
}
export interface DevicePool {
  id:number,
  name:string,
  desc?: string,
  devices?: [Device]
}

const sampleBorrowData = [
  {id:1, img: "", title:"Devie1"},
  {id:2,img: "", title:"Devie2"},
  {id:3,img: "", title:"Devie3"},
  {id:4,img: "", title:"Devie4"},
  {id:5,img: "", title:"Devie5"},
  {id:6,img: "", title:"Devie6"},
  {id:7,img: "", title:"Devie7"},
  {id:8,img: "", title:"Devie8"}
];
const samppleRequestsData = [
  {id:1, type:1, title:"request1", from: new Date(), to:new Date()},
  {id:2, type:2, title:"request2", from: new Date(), to:new Date()},
  {id:3, type:1, title:"request3", from: new Date(), to:new Date()},
  {id:4, type:2, title:"request4", from: new Date(), to:new Date()},
  {id:5, type:1, title:"request5", from: new Date(), to:new Date()},
  {id:6, type:1, title:"request6", from: new Date(), to:new Date()},
  {id:7, type:1, title:"request7", from: new Date(), to:new Date()}
];
const sampleDeviceData = [
  {id:1, name: "Pool1", devices:[
    {id:1,  title:"Devie1"},
    {id:2, title:"Devie2"}
  ]},
  {id:2, name: "Pool2", devices:[
    {id:4, title:"Devie4"},
    {id:5, title:"Devie5"},
    {id:6, title:"Devie6"},
    {id:7, title:"Devie7"},
    {id:8, title:"Devie8"}
  ]},
];


@Injectable({
  providedIn: 'root'
})
export class DataService {

  private static TOKEN = "vlnx-jwt";

  private _borrowData: BehaviorSubject<[BorrowDevice]>;
  private _requestData: BehaviorSubject<[Request]>;
  private _devicesData: BehaviorSubject<[DevicePool]>;

  public dateFrom:Date;
  public dateTo:Date;
  public expandedPool:number;
  public searchString:string;

  constructor(private http: HttpClient) {
    this._borrowData = <BehaviorSubject<[BorrowDevice]>>new BehaviorSubject(sampleBorrowData);
    this._requestData = <BehaviorSubject<[Request]>>new BehaviorSubject(samppleRequestsData);
    this._devicesData = <BehaviorSubject<[DevicePool]>>new BehaviorSubject(sampleDeviceData);
    this.dateFrom = new Date();
    this.dateTo = new Date();
    this.expandedPool = -1;
    this.searchString = undefined;
  }

  get borrowData(){
    // http get borrow data
    return this._borrowData.asObservable();
  }
  get requestData(){
    // http get requests odered by date data
    return this._requestData.asObservable();
  }


  // Device Pools
  get devicesData(){
    // http get requests device pools
    return this._devicesData.asObservable();
  }
  addPool(pool:DevicePool){
    // http add pool here
    console.log("Add Pool", pool);
  }
  deletePool(pool: DevicePool){
    // http delete pool here
    console.log("Delete Pool", pool);
  }
  editPool(pool: DevicePool){
    // http edit pool here
    console.log("Edit Pool", pool);
  }

  // Devices
  deleteDevice(d:Device){
    console.log("Delete device", d);
  }
  addDevice(d:Device){
    console.log("add device", d);
  }
  editDevice(d:Device){
    console.log("edit device", d);
  }

  getDevice(id:number){
    //http get one device
    return sampleBorrowData[0];
  }

  // User
  updatePw(oldPW:string, newPw:string){
    console.log("Update PW", oldPW, newPw);
  }
  updateUserData(name:string, email:string){
    console.log("Update User Data", name,email);
  }


}
