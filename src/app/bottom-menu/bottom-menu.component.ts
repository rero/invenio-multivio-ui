import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-bottom-menu',
  templateUrl: './bottom-menu.component.html',
  styleUrls: ['./bottom-menu.component.css']
})
export class BottomMenuComponent implements OnInit {

  isVisible: boolean = false;
  opacityVal: any ;
  constructor() { }

  ngOnInit() {
  }

  toggleVisibility(){
    this.isVisible = !this.isVisible;
  }


}
