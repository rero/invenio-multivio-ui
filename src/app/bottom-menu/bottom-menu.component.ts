import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BottomMenu } from '../bottom-menu.enum';
import { Display } from '../display.enum';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-bottom-menu',
  templateUrl: './bottom-menu.component.html',
  styleUrls: ['./bottom-menu.component.css']
})
export class BottomMenuComponent implements OnInit {

  @Output() pageChanged = new EventEmitter();

  isVisible: boolean = false;
  currentPage: number = 1;
  minValuePage: number = 1;
  maxValuePage: number = 0;
  currentAngle: number = 0;
  typeDisplay: number;
  BottomMenu = BottomMenu;

  constructor(private message: NzMessageService) { 
  }

  ngOnInit() {
  }

  toggleVisibility(){
    this.isVisible = !this.isVisible;
  }

  onMenuClick(key: BottomMenu){
    if(this.currentPage <= this.maxValuePage && this.currentPage >= this.minValuePage){
      switch (key) {
        case BottomMenu.DecrementPage:
          if(this.currentPage > this.minValuePage){
            this.currentPage--;
          }
          break;
        case BottomMenu.FirstPage:
          this.currentPage = this.minValuePage;
          break;
        case BottomMenu.IncrementPage:
          if(this.currentPage < this.maxValuePage){
            this.currentPage++;
          }
          break;
        case BottomMenu.LastPage:
          this.currentPage = this.maxValuePage;
          break;
        case BottomMenu.RotateLeft:
          this.currentAngle = (this.currentAngle + 90)%360;
          break;
        case BottomMenu.RotateRight:
          this.currentAngle = (this.currentAngle - 90)%360;
          break;
        case BottomMenu.ZoomOut:
          this.typeDisplay = Display.ZoomOut;
          break;
        case BottomMenu.ZoomIn:
          this.typeDisplay = Display.ZoomIn;
          break; 
        case BottomMenu.FitToHeight:
          console.log("FitToHeight");
          this.typeDisplay = Display.FitToHeight;
          break;   
        case BottomMenu.FitToWidth:
          console.log("FitToWidth");
          this.typeDisplay = Display.FitToWidth;
          break;   
        case BottomMenu.OriginalSize:
          console.log("OriginalSize");
          this.typeDisplay = Display.OriginalSize;
          break;    
      }
      this.pageChanged.emit({"Page":this.currentPage,"Angle": this.currentAngle,"Display": this.typeDisplay});
      this.typeDisplay=-1
    }
    else{
      this.message.create('warning', `Vous avez insérez un nombre qui n'est pas compri entre : ${this.minValuePage} et ${this.maxValuePage} `);
    }
  }

  getPage(nrPage: number){
    if(nrPage <= this.maxValuePage && nrPage >= this.minValuePage){
      this.currentPage = nrPage;
    }
    else if(nrPage < this.minValuePage){
      this.message.create('warning', `Vous avez insérez un nombre inférieur au minimum consenti ( ${this.minValuePage} )`);
      this.currentPage = this.minValuePage;
    }
    else{
      this.message.create('warning', `Vous avez insérez un nombre supérieur au maximum consenti ( ${this.maxValuePage} )`);
      this.currentPage = this.maxValuePage;
    }
    this.pageChanged.emit({"Page":this.currentPage,"Angle": this.currentAngle,"Display": this.typeDisplay});
  }
}
