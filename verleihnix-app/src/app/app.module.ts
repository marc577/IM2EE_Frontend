import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';

import {MatTabsModule} from '@angular/material/tabs';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatCardModule} from '@angular/material/card';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material';
import {MatRadioModule} from '@angular/material/radio';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatListModule} from '@angular/material/list';
import {MatChipsModule} from '@angular/material/chips';
import {MatDialogModule} from '@angular/material/dialog';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatMenuModule} from '@angular/material/menu';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatStepperModule} from '@angular/material/stepper';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatBadgeModule} from '@angular/material/badge';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent,EditPersonalDialog } from './home/home.component';
import { BorrowComponent } from './borrow/borrow.component';
import { RequestsComponent } from './requests/requests.component';
import { DevicesComponent } from './devices/devices.component';
import { FilterPipe } from './filter.pipe';
import { DeviceDetailComponent, DialogNewRequestDialog } from './device-detail/device-detail.component';
import { DeviceEditComponent } from './device-edit/device-edit.component';
import { DeviceListComponent } from './device-list/device-list.component';
import { PoolsComponent, AddPoolDialog } from './pools/pools.component';
import { Interceptor } from './services/interceptor.service';
import { RequestsListComponent, DialogRejectRequestDialog } from './requests-list/requests-list.component';
import { ChatComponent } from './chat/chat.component';
import { CommonModule } from '@angular/common';

@NgModule({
  entryComponents:[
    DialogRejectRequestDialog,
    DialogNewRequestDialog,
    AddPoolDialog,
    EditPersonalDialog
  ],
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    BorrowComponent,
    RequestsComponent,
    DevicesComponent,
    FilterPipe,
    DeviceDetailComponent,
    DeviceEditComponent,
    DeviceListComponent,
    DialogRejectRequestDialog,
    DialogNewRequestDialog,
    PoolsComponent,
    AddPoolDialog,
    EditPersonalDialog,
    RequestsListComponent,
    ChatComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatInputModule,
    MatButtonModule,
    MatGridListModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatMenuModule,
    MatExpansionModule,
    MatRadioModule,
    MatListModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatBadgeModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatStepperModule,
    MatButtonToggleModule,
    MatCardModule,
    MatDialogModule,
    MatIconModule
  ],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'de-DE'},
    {provide: HTTP_INTERCEPTORS, useClass: Interceptor, multi:true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
