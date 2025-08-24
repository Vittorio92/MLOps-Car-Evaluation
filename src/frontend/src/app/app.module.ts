import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AuthModule } from '@auth0/auth0-angular';

import { DatasetManagementPageComponent } from './components/dataset-management-page/dataset-management-page.component';
import { ErrorPageComponent } from './components/error-page/error-page.component';
import { CarEvaluationPageComponent } from './components/car-evaluation-page/car-evaluation-page.component';
import { CarFormComponent } from './components/car-form/car-form.component';
import { PredictionResultComponent } from './components/prediction-result/prediction-result.component';

import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { UploadAreaComponent } from './components/upload-area/upload-area.component';
import { CurrentDatasetCardComponent } from './components/current-dataset-card/current-dataset-card.component';

import { environment } from '../environment';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BytesToReadablePipe } from './utils/bytesToReadable';
import { ListPredictionsComponent } from './components/list-predictions/list-predictions.component';


@NgModule({
  declarations: [
    AppComponent,
    DatasetManagementPageComponent,
    ErrorPageComponent,
    CarEvaluationPageComponent,
    CarFormComponent,
    PredictionResultComponent,
    UploadAreaComponent,
    CurrentDatasetCardComponent,
    BytesToReadablePipe,
    ListPredictionsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AuthModule.forRoot({
      domain: environment.auth.domain,
      clientId: environment.auth.clientId,
      authorizationParams:{
        redirect_uri: environment.auth.redirectUri
      }
    }),
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
