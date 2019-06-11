import { Component, OnInit, OnDestroy } from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import {Observable, Subscription} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { Product, DataService, Insertion, ProductInsertion } from '../services/data.service';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-device-edit',
  templateUrl: './device-edit.component.html',
  styleUrls: ['./device-edit.component.css']
})
export class DeviceEditComponent implements OnInit, OnDestroy {

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  productCtrl:FormControl;
  descCtrl:FormControl;

  products: Product[];
  product:Product;
  newProduct:boolean;
  poolId:number;
  insertionId:number;
  insertion:Insertion;
  loading:boolean;

  sub:Subscription;
  subProducts:Subscription;
  filteredOptions: Observable<Product[]>;

  subInsertion:Subscription;

  private newImgString;

  constructor(private _formBuilder: FormBuilder, private service:DataService, private aRoute:ActivatedRoute, private snackBar: MatSnackBar) {
    this.loading = true;
    this.newProduct = true;
    this.product = null;
    this.subProducts = this.service.productData.subscribe((products) => {
      this.products = products;
    });
    this.productCtrl = new FormControl('', Validators.required);
    this.descCtrl = new FormControl('', Validators.required);
    this.sub = this.aRoute.params.subscribe(params => {
      this.poolId = +params['pid'];
      this.insertionId = +params['id'];
      if(this.insertionId != -1){
        this.subInsertion = this.service.getInsertion(this.insertionId).subscribe((data) => {
          this.insertion = data.insertion;
          this.setProduct(data.product);
          this.product = data.product;
          this.loading = false;
        }, (er)=> {this.service.catchError(er)});
      }else{
        this.insertion = {title:"", description:"", active:true, id:-1, image:null, pricePerDay: 0.0};
        this.loading = false;
      }
    });
  }

  ngOnInit() {

    this.firstFormGroup = new FormGroup({
      productCtrl: this.productCtrl,
      descCtrl: this.descCtrl
    });
    this.secondFormGroup = this._formBuilder.group({
      titleCtrl: ['', Validators.required],
      descriptionCtrl: ['', Validators.required],
      priceCtrl: [0],
      activeRequired: true,
    });
    this.filteredOptions = this.productCtrl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }

  private setProduct(p:Product){
    this.product = p;
    this.newProduct = false;
    this.productCtrl.setValue(this.product.title);
    this.descCtrl.disable();
  }

  private _filter(value: string): Product[] {
    if(this.newProduct == false){
      this.newProduct = true;
    }else{
      this.product = null;
      this.descCtrl.enable();
    }
    const filterValue = value.toLowerCase();
    return this.products.filter(p => p.title.toLowerCase().indexOf(filterValue) === 0);
  }
  selected(p:Product){
    this.newProduct = false;
    this.product = p;
    this.descCtrl.disable();
  }
  save(){
    this.loading = true;
    if(this.product == null && this.firstFormGroup.valid){
      this.product = {title: this.productCtrl.value, description: this.descCtrl.value, id:-1, minPricePerDay:0, image:""};
    }
    const data:ProductInsertion = {product: this.product, insertion: this.insertion};
    
    this.service.updateInsertion(this.poolId, data).subscribe((d) => {
      if(this.newProduct == true){
        this.products.push(d.product);
      }
      this.setProduct(d.product);
      if(this.newImgString != null){
        this.service.updateInsertionImage(d.insertion.id, this.newImgString).subscribe(val => {
          this.newImgString = null;
          this.finishLoading();
        });
      }else{
        this.finishLoading();
      }
    }, (er)=>{this.service.catchError(er)});
  }

  private finishLoading(){
    this.loading = false;
    this.snackBar.open("Gespeichert", "OK", {
      duration: 2000,
      verticalPosition:"top"
    });
  }

  ngOnDestroy(){
    this.sub.unsubscribe();
    this.subProducts.unsubscribe();
    if(this.subInsertion){
      this.subInsertion.unsubscribe();
    }
  }

  //file Upload
  handleInputChange(e) {
    var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    var pattern = /image-*/;
    var reader = new FileReader();
    if (!file.type.match(pattern)) {
      alert('invalid format');
      return;
    }
    reader.onload = this._handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);
  }
  _handleReaderLoaded(e) {
    let reader = e.target;
    var imgString = reader.result;
    this.newImgString = imgString;
    this.insertion.image = this.newImgString;
  }

}
