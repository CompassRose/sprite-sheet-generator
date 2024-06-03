import { Injectable } from '@angular/core';
import * as csvParser from 'csv-parser';
import { Readable } from 'stream';
import { Observable, map } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})



export class AirlineCodesService {

    public AirlineCodes = '../../assets/json/airlineCodes.json';

    constructor(private http: HttpClient) {
        console.log('AirlineCodesService')

    }



}

