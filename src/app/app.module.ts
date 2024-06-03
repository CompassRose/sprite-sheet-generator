import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { SpriteGeneratorComponent } from './sprite-generator/sprite-generator.component';
import { AirlineCodesService } from './airline-codes.service';


@NgModule({
  declarations: [
    AppComponent,
    SpriteGeneratorComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [
    AirlineCodesService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
