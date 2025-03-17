import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";
import { Observable, throwError } from "rxjs";
import { catchError, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { environment } from "./environments";

const apiUrl: string = environment.apiURL + "UserMaster/Login"; //"http://192.168.29.223/calculator/api/Auth/login";

@Injectable({
    providedIn: 'root' // or specify a module where it should be provided
})

export class AuthService {
    constructor(private http: HttpClient, private router: Router) {

    }
    private isUserLoggedIn = this.hasToken();

    public login(user: string, password: string, isPinLogin: boolean): Observable<any> {

        const reqParam = '?mobileNo=' + user
            + '&password=' + password
            + '&isPinLogin=' + isPinLogin;

        const data = {
            UserName: user,
            Password: password
        };

        // return this.http.post<any>(apiUrl , data)
        //     .pipe((data: any) => {
        //     debugger;
        //     this.isUserLoggedIn = true;
        //     //localStorage.setItem('AuthorizeData', JSON.stringify(data));
        //     return data;
        // });

        return this.http.get<any>(apiUrl + reqParam).pipe(
            map((response) => response), // You can directly return the response as data
            catchError((err) => throwError(err)) // Handle errors
        );
    }

    private hasToken() {
        return !!localStorage.getItem('AuthorizeData');
    }

    public get isAuthenticated(): boolean {
        return (this.isUserLoggedIn && this.hasToken());
    }

    logOut(anyParam = ''): any {
        try {
            localStorage.removeItem('AuthorizeData');
            this.router.navigate(['/login']);
        }
        catch (error) {
            console.log(error);
        }
        finally {
        }
    }
}