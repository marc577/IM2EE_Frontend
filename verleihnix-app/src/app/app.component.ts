import { Component, OnDestroy} from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { DataService } from './services/data.service';
import { Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy {

  title = 'verleihnix-app';
  subError: Subscription;

  constructor( private snackBar: MatSnackBar, private dateAdapter: DateAdapter<Date>, private service:DataService){
    this.dateAdapter.setLocale('de');
    this.dateAdapter.getFirstDayOfWeek = () => { return 1; }
    this.subError = this.service.error.subscribe((error: HttpErrorResponse) =>{
      if(error != null){
        this.snackBar.open(error.message, "OK", {
          duration: 3000,
          verticalPosition:"top"
        })
      }
    });
  }

  ngOnDestroy(){
    this.subError.unsubscribe();
  }
}
