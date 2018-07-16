import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BottomMenu } from '../enum/bottom-menu.enum';
import { Display } from '../enum/display.enum';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-bottom-menu',
  templateUrl: './bottom-menu.component.html',
  styleUrls: ['./bottom-menu.component.css']
})

export class BottomMenuComponent implements OnInit {

  @Output() pageChanged = new EventEmitter();

  BottomMenu = BottomMenu;
  isVisible = false;
  currentPage = 1;
  minValuePage = 1;
  maxValuePage = 0;
  currentAngle = 0;
  typeDisplay: number;
  isDisabled = false;
  nbrDocs = 0;
  currentDoc = 0;
  mode = '';

  constructor(private message: NzMessageService) {}

  ngOnInit() {}

  // Toggle the visibility of collapsed menu
  toggleVisibility() {
    this.isVisible = !this.isVisible;
  }

  // Dispatch on bottom menu click
  onMenuClick(key: BottomMenu) {
    // Update image content on option clicked (emit to parent)
    if (this.currentPage <= this.maxValuePage && this.currentPage >= this.minValuePage) {
      switch (key) {
        case BottomMenu.DecrementPage:
          if (this.currentPage === this.minValuePage) {
            if (this.currentDoc > 0) {
              this.currentDoc--;
              this.mode = 'Back';
            }
          } else if (this.currentPage > this.minValuePage) {
            this.currentPage--;
          }
          break;
        case BottomMenu.FirstPage:
          if (this.currentPage === this.minValuePage) {
            if (this.currentDoc > 0) {
              this.currentDoc--;
              this.mode = 'Back';
            }
          } else {
            this.currentPage = this.minValuePage;
          }
          break;
        case BottomMenu.IncrementPage:
          if (this.currentPage === this.maxValuePage) {
            if (this.currentDoc < this.nbrDocs) {
              this.currentDoc++;
              this.currentPage = 1;
            }
          } else if (this.currentPage < this.maxValuePage) {
            this.currentPage++;
          }
          break;
        case BottomMenu.LastPage:
          if (this.currentPage === this.maxValuePage) {
            if (this.currentDoc < this.nbrDocs) {
              this.currentDoc++;
              this.currentPage = 1;
            }
          } else {
            this.currentPage = this.maxValuePage;
          }
          break;
        case BottomMenu.RotateLeft:
          this.currentAngle = (this.currentAngle + 90) % 360;
          break;
        case BottomMenu.RotateRight:
          this.currentAngle = (this.currentAngle - 90) % 360;
          break;
        case BottomMenu.ZoomOut:
          this.typeDisplay = Display.ZoomOut;
          break;
        case BottomMenu.ZoomIn:
          this.typeDisplay = Display.ZoomIn;
          break;
        case BottomMenu.FitToHeight:
          this.typeDisplay = Display.FitToHeight;
          break;
        case BottomMenu.FitToWidth:
          this.typeDisplay = Display.FitToWidth;
          break;
        case BottomMenu.OriginalSize:
          this.typeDisplay = Display.OriginalSize;
          break;
      }
      // Emit message to parent
      this.pageChanged.emit({'Page': this.currentPage, 'Angle': this.currentAngle, 'Display': this.typeDisplay,
       'Doc': this.currentDoc, 'Mode': this.mode});
      this.typeDisplay = -1;
      this.mode = '';
    } else {
      // Display message error
      this.message.create('warning', `Vous avez insérez un nombre qui n'est pas compri entre :
       ${this.minValuePage} et ${this.maxValuePage} `);
    }
  }

  // Get page from input
  getPage(nrPage: number) {
    if (nrPage <= this.maxValuePage && nrPage >= this.minValuePage) {
      this.currentPage = nrPage;
      // Emmit message to parent
      this.pageChanged.emit({ 'Page': this.currentPage, 'Angle': this.currentAngle, 'Display': this.typeDisplay });
    } else if (nrPage < this.minValuePage) {
      // Display message error
      this.message.create('warning', `Vous avez insérez un nombre inférieur au minimum consenti ( ${this.minValuePage} )`);
      this.currentPage = this.minValuePage;
    } else {
      // Displax message error
      this.message.create('warning', `Vous avez insérez un nombre supérieur au maximum consenti ( ${this.maxValuePage} )`);
      this.currentPage = this.maxValuePage;
    }  
  }

  // Set numbers of documents in the app
  setNumberDocs(nbr: number) {
    this.nbrDocs = nbr - 1;
  }

  // Set actual document in app
  setCurrentDoc(nbr: number) {
    this.currentDoc = nbr;
  }
}
