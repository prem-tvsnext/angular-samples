import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {MatInputModule} from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import {MatTooltipModule} from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatFormFieldModule} from '@angular/material/form-field';
//import { BingSpellcheckerModule } from 'ngx-bing-spellchecker';
import {HotkeyModule} from 'angular2-hotkeys';
//import { NgxChartsModule } from '@swimlane/ngx-charts';
import {MatTableModule} from '@angular/material/table';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';

import { AppComponent } from './app.component';
import { TooltipDirective } from './tooltip'


@NgModule({
  declarations: [
    AppComponent,
    TooltipDirective
  ],
  imports: [
    BrowserModule,
    MatInputModule,
    FormsModule,
    MatTooltipModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    //BingSpellcheckerModule,
    RouterModule.forRoot([]),
    HotkeyModule.forRoot(),
    //NgxChartsModule,
    MatTableModule,
    MatSelectModule,
    MatButtonModule,
    MatCheckboxModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
