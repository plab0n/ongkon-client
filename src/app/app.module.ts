import { DialogAllModule } from '@syncfusion/ej2-angular-popups';

import { AccumulationChartModule } from '@syncfusion/ej2-angular-charts';

import { AccumulationAnnotationService, AccumulationDataLabelService, AccumulationLegendService, AccumulationTooltipService, ChartAllModule } from '@syncfusion/ej2-angular-charts';

import { DiagramAllModule, SymbolPaletteAllModule, OverviewAllModule } from '@syncfusion/ej2-angular-diagrams';

import { GridAllModule } from '@syncfusion/ej2-angular-grids';

import { ListViewAllModule } from '@syncfusion/ej2-angular-lists';

import { DateRangePickerModule } from '@syncfusion/ej2-angular-calendars';

import { CircularGaugeModule } from '@syncfusion/ej2-angular-circulargauge';

import { DropDownListAllModule } from '@syncfusion/ej2-angular-dropdowns';

import { MultiSelectModule } from '@syncfusion/ej2-angular-dropdowns';

import { ToolbarModule } from '@syncfusion/ej2-angular-navigations';

import { NumericTextBoxModule, ColorPickerModule, UploaderModule, TextBoxModule } from '@syncfusion/ej2-angular-inputs';

import {DropDownButtonModule, SplitButtonModule} from '@syncfusion/ej2-angular-splitbuttons';

import { ButtonModule, CheckBoxModule, RadioButtonModule } from '@syncfusion/ej2-angular-buttons';

import { BrowserModule } from '@angular/platform-browser';

import { NgModule } from '@angular/core';
import {AppComponent} from "./app.component";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { WhiteboardInfoDialogComponent } from './components/whiteboard-info-dialog/whiteboard-info-dialog.component';
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {FormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import { WhiteboardContainerComponent } from './components/whiteboard-container/whiteboard-container.component';
import {AppRoutingModule} from "./app-routing.module";

@NgModule({
  declarations: [ AppComponent, WhiteboardInfoDialogComponent, WhiteboardContainerComponent ],
  imports: [ DiagramAllModule, ChartAllModule, GridAllModule, SymbolPaletteAllModule, OverviewAllModule, ButtonModule,
    ColorPickerModule,  DateRangePickerModule, CheckBoxModule, AccumulationChartModule, BrowserModule,ToolbarModule,
    DropDownButtonModule, UploaderModule, CircularGaugeModule, DropDownListAllModule, ListViewAllModule,
    DialogAllModule, TextBoxModule, RadioButtonModule, MultiSelectModule, NumericTextBoxModule, BrowserModule, SplitButtonModule,
    HttpClientModule, BrowserAnimationsModule, MatDialogModule, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
