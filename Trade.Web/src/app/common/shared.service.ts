import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../environments';
//import {config} from '../../assets/config/app.config';

const apiUrl: string = environment.apiURL; //http://192.168.29.223/calculator/api/";

//const apiKey = config.apiKey;
@Injectable({
  providedIn: 'root' // or specify a module where it should be provided
})
export class SharedService {

  constructor(private httpClient: HttpClient) { }

  customGetApi(api: string): Observable<ApiResponse> {
    return this.httpClient.get<any>(apiUrl + api).pipe(map(t => t), catchError(err => throwError(err)));
  }
  customGetApi1<T>(api: string, params?: any): Observable<T> {
    let httpParams = new HttpParams();
    // Append parameters if they are provided
    if (params) {
      Object.keys(params).forEach((key) => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.append(key, params[key]);
        }
      });
    }

    return this.httpClient.get<T>(apiUrl + api, { params: httpParams }).pipe(
      map((response) => response), // You can directly return the response as data
      catchError((err) => throwError(err)) // Handle errors
    );
  }

  customPostApi(api: string, data: any): Observable<ApiResponse> {
    return this.httpClient.post<any>(apiUrl + api, data).pipe(map(t => t), catchError(err => throwError(err)));
  }

  customPutApi(api: string, data: any): Observable<ApiResponse> {
    return this.httpClient.put<ApiResponse>(apiUrl + api, data).pipe(
      map(t => t),
      catchError(err => throwError(err))
    );
  }

  customDeleteApi(api: string): Observable<ApiResponse> {
    return this.httpClient.delete<ApiResponse>(apiUrl + api).pipe(
      map((response) => response),  // Process the response (you can also modify this if needed)
      catchError((err) => throwError(err))  // Handle any errors
    );
  }

  JsonConvert<T>(jsonString: string): T {
    const obj = JSON.parse(jsonString);
    return obj as T;
  }
}

export class ApiResponse {
  success: boolean = false;
  statusCode: number;
  sessage: string = '';
  data: any
}


