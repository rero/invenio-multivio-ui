import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BottomMenu } from '../bottom-menu.enum';

@Component({
  selector: 'app-bottom-menu',
  templateUrl: './bottom-menu.component.html',
  styleUrls: ['./bottom-menu.component.css']
})
export class BottomMenuComponent implements OnInit {

  @Output() pageChanged = new EventEmitter();

  isVisible: boolean = false;
  currentValue: number = 1;
  minValuePage: number = 1;
  maxValuePage: number = 0;
  BottomMenu = BottomMenu;

  constructor() { }

  ngOnInit() {
  }

  toggleVisibility(){
    this.isVisible = !this.isVisible;
  }

  onMenuClick(key: BottomMenu){
    switch (key) {
      case BottomMenu.DecrementPage:
        console.log("DecrementPage");
        if(this.currentValue > this.minValuePage){
          this.currentValue--;
        }
        break;
      case BottomMenu.FirstPage:
        console.log("FirstPage");
        this.currentValue = this.minValuePage;
        break;
      case BottomMenu.IncrementPage:
        console.log("IncrementPage");
        if(this.currentValue < this.maxValuePage){
          this.currentValue++;
        }
        break;
      case BottomMenu.LastPage:
        console.log("LastPage");
        this.currentValue = this.maxValuePage
        break;
      case BottomMenu.RotateLeft:
        console.log("RotateLeft");
        break;
      case BottomMenu.RotateRight:
        console.log("RotateRight");  
        break;
      case BottomMenu.ZoomOut:
        console.log("ZommOut");
        break;
      case BottomMenu.ZoomIn:
        console.log("ZoomIn");
        break;    
    }
    this.pageChanged.emit(this.currentValue);
  }

  setMaxPage(max: number){
    this.maxValuePage = max;
  }

}
