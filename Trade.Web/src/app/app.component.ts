import { Component, OnInit } from '@angular/core';
import { App } from '@capacitor/app';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Trade.Web';

  constructor(private primengConfig: PrimeNGConfig) {

  }

  ngOnInit() {
    this.primengConfig.ripple = true;
    App.addListener('backButton', (event) => {
      if (window.location.pathname === '/home') {
        App.exitApp(); // Exit app if on home screen
      } else {
        window.history.back(); // Navigate back
      }
    });
  }

}
