import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedService } from '../common/shared.service';
import { AuthService } from '../auth.service';

export class RememberLogin {
  username: string;
  password: string;
  rememberme: string;
  isPinLogin: boolean = false;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoggedIn = false;
  showCompanySelection = false;
  loading = false;
  rememberMe: boolean = false;
  RememberLogin: RememberLogin = new RememberLogin;
  loginType: string = 'password';
  pin1: number;
  pin2: number;
  pin3: number;
  pin4: number;
  isButtonDisabled: boolean = false;

  constructor(private fb: FormBuilder, private router: Router, private shared: SharedService, private authService: AuthService) {
    this.isLoggedIn = false;
    this.loginForm = fb.group({
      username: ['', Validators.required],
      password: [''],
      rememberMe: [null, null],
      pin1: [''],
      pin2: [''],
      pin3: [''],
      pin4: [''],
    });
  }

  ngOnInit(): void {
    var data = localStorage.getItem('loginremember');
    if (data != null) {
      var loginData = JSON.parse(data);
      if (loginData?.rememberme == "true") {
        this.loginForm.get("username")?.setValue(loginData.username);
        this.loginForm.get("password")?.setValue(loginData.password);
        this.rememberMe = true
      }
      else {
        this.rememberMe = false
      }

      if (loginData?.username?.length > 0 && loginData.isPinLogin) {
        this.loginForm.get("username")?.setValue(loginData.username);
        this.loginType = 'pin';
      }
    }

    this.loginForm.get('username')?.valueChanges.subscribe((value) => {
      if (value.length > 0) {
        this.isButtonDisabled = false; // Disable button if the username input is empty
      }
      else{
        this.isButtonDisabled = true;
      }
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      this.loading = true;
      let isPinLogin = false;
      let password = this.loginForm.get("password")?.value;
      if (this.loginType === 'pin') {
        isPinLogin = true;
        password = [
          this.loginForm.get("pin1")?.value,
          this.loginForm.get("pin2")?.value,
          this.loginForm.get("pin3")?.value,
          this.loginForm.get("pin4")?.value
        ].join('');
      }
      this.authService.login(this.loginForm.get("username")?.value, password, isPinLogin)
        .subscribe((response: any) => {
          // if (response.success == true){
          if (response != null) {
            localStorage.setItem('AuthorizeData', JSON.stringify(response));
            localStorage.setItem("userid", response.id);
            if (this.rememberMe || this.loginType === 'pin') {
              if (this.loginType === 'pin') {
                this.RememberLogin.username = this.loginForm.get("username")?.value;
                this.RememberLogin.isPinLogin = true;
              }
              else {
                this.RememberLogin.username = this.loginForm.get("username")?.value;
                this.RememberLogin.password = this.loginForm.get("password")?.value;
                this.RememberLogin.rememberme = this.rememberMe.toString();
                this.RememberLogin.isPinLogin = false;
              }
              localStorage.setItem("loginremember", JSON.stringify(this.RememberLogin))
            }
            else {
              localStorage.removeItem("loginremember")
            }
            this.loading = false;
            this.showCompanySelection = true;
            this.router.navigate(['/dashboard']);
            //   }
          }
          else {
            localStorage.removeItem("userid");
          }
        }, (ex: any) => {
          this.loading = false;
          localStorage.removeItem("loginremember")
          alert('Invalid Username/Password.');
        });
    }
  }

  onPinInput(event: any, nextField: string) {
    const currentValue = event.target.value;
    if (currentValue && nextField) {
      // Focus on the next input field
      const nextInput = document.querySelector(`[formControlName="${nextField}"]`) as HTMLInputElement;
      if (nextInput) nextInput.focus();
    }
  }

  selectLoginType(type: 'password' | 'pin') {
    this.loginType = type;
  }
}
