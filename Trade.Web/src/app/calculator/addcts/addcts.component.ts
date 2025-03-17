import { Component, OnInit } from '@angular/core';

interface City {
  name: string;
  code: string;
}

interface Items {
  size: string,
  number: string,
  carat: number
}

@Component({
  selector: 'app-addcts',
  templateUrl: './addcts.component.html',
  styleUrls: ['./addcts.component.scss']
})

export class AddctsComponent implements OnInit {
  cities: City[] = [];
  caratData: Items[] = [];
  sizes: any;
  number: any;
  selectednumber: string = "10";
  selectedsize: string = "1";
  selectedcarat : number = 0;
  selectedsizeonly: any = [];


  ngOnInit() {
      this.cities = [
          { name: 'New York', code: 'NY' },
          { name: 'Rome', code: 'RM' },
          { name: 'London', code: 'LDN' },
          { name: 'Istanbul', code: 'IST' },
          { name: 'Paris', code: 'PRS' }
      ];

      this.sizes =  [
        {
          size:"1",
          value:"1"
        },
        {
          size:"2",
          value:"2"
        },
        {
          size:"3",
          value:"3"
        },
        {
          size:"4",
          value:"4"
        },
        {
          size:"5",
          value:"5"
        },
      ];

      this.number =  [
        {
          number:"10"
        },
        {
          number:"20"
        },
        {
          number:"30"
        },
        {
          number:"40"
        },
        {
          number:"50"
        },
      ]
  }

  constructor(){
    this.selectedcarat = 0;
  }
  
  addCts(){
    debugger;
    this.caratData.push({
      size: this.selectedsize,
      number: this.selectednumber,
      carat: this.selectedcarat
    });
    if (this.selectedsizeonly.findIndex((s: any) => s == this.selectedsize) < 0){
      this.selectedsizeonly.push(this.selectedsize);
    }    
  }

  deletects(item: any){
    debugger
    var index = this.caratData.indexOf(item);
    if (index >= 0){
      this.caratData.splice(index, 1);
    }
    if (this.caratData.filter(e => e.size == item.size).length == 0){
      var ind = this.selectedsizeonly.indexOf(item.size);
      if (ind >= 0){
        this.selectedsizeonly.splice(ind,1);
      }
    }
  }

  handlesize(event: any) {
    this.selectedsize = event.value.value;
  }

  viewdata(){
    debugger;
    console.log(this.caratData);
  }

  handlenumber(event: any) {
    this.selectednumber = event.value.number;
  }

  getItemsBySize(size: string){
    return this.caratData.filter(item => item.size === size);
  }

  // updateValue(value: number, item: any, field: string) {
  //   debugger;
  //   if (item != null){
  //     item[field] = value;
  //   }
  // }

  updateValue(value: string | null, item: any, key: string) {
    if (value !== null && value !== undefined) {
      const val = parseInt(value);
      item[key] = val;
    }
  }

  isHTMLInputElement(target: EventTarget | null): target is HTMLInputElement {
    return target instanceof HTMLInputElement;
  }
  
}
