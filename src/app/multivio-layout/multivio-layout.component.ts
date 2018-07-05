import { Component, OnInit , ViewChild, Input} from '@angular/core';
import { CollapsedMenuComponent } from '../collapsed-menu/collapsed-menu.component';
import { BottomMenuComponent } from '../bottom-menu/bottom-menu.component';
import { ContentComponent } from '../content/content.component';
import { DocumentService } from '../document.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Menu } from '../menu.enum';
import { Display } from '../display.enum';
import { ResizedEvent } from 'angular-resize-event/resized-event';  //TODO: put to layout?

@Component({
  selector: 'app-multivio',
  templateUrl: './multivio-layout.component.html',
  styleUrls: ['./multivio-layout.component.css']
})
export class MultivioLayoutComponent implements OnInit {

 
  @ViewChild(CollapsedMenuComponent)
  private collapsedMenuComponent: CollapsedMenuComponent;
  @ViewChild(BottomMenuComponent)
  private bottomMenuComponent: BottomMenuComponent;
  @ViewChild(ContentComponent)
  private contentComponent: ContentComponent;

  @Input() urlDocument: string;

  Menu = Menu;
  isCollapsed: boolean = false;
  isReverseArrow: boolean = false;
  width: number  = 200;
  title: string = "";
  creator: string = "";
  contentHeight: number = 0; 
  contentWidth: number = 0;
  maxHeight: number = 0; 
  maxWidth: number = 0;
  originalHeight: number = 0;
  originalWidth: number = 0;
  currentPage: number= 1;
  anglePage: number = 0;
  firstRendering: boolean = false;

  constructor(private documentService:DocumentService,private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.documentService.setUrlDocument(this.urlDocument);
    this.loadMetadata();
  }

  onMenuClick(e:Menu) {
    if(e != Menu.BottomMenuVisible && e != Menu.Download){
      this.collapsedMenuComponent.collapse(e);
    }
    else{
      switch (e) {
        case Menu.BottomMenuVisible:
          this.toggleBottomMenu();
          break;
        case Menu.Download:
          this.downloadFile();
          break;
      }
    }
  }

  toggleBottomMenu(){
    this.bottomMenuComponent.toggleVisibility()
  }

  updatePage(event: Object){
    this.bottomMenuComponent.currentPage = event["Page"];
    this.currentPage = event["Page"]
    this.anglePage = event["Angle"]
    switch (event["Display"]) {
      case Display.ZoomIn:
        this.contentWidth = Math.round(this.contentWidth +  this.contentWidth / 100 * 20)
        this.contentHeight = Math.round(this.contentHeight +  this.contentHeight / 100 * 20)
        break;
      case Display.ZoomOut:
        this.contentWidth = Math.round(this.contentWidth -  this.contentWidth / 100 * 20)
        this.contentHeight = Math.round(this.contentHeight -  this.contentHeight / 100 * 20)  
        break;
      case Display.FitToWidth:
        this.contentWidth = this.maxWidth;
        this.contentHeight = this.maxWidth * 2;
        break;
      case Display.FitToHeight:
        this.contentHeight = this.maxHeight;
        this.contentWidth = this.maxHeight;
        break;
      case Display.OriginalSize:
        this.contentWidth = this.originalWidth;
        this.contentHeight = this.originalHeight;
        break;
      
    }

    
    this.getImage(this.currentPage, this.anglePage, this.contentWidth, this.contentHeight);
  }

  loadMetadata(){
    this.documentService.getMetadata().subscribe(res => {
      if(res['title'].length <= 1)
        this.title = " ";
      else
        this.title = res['title'];

      if(res['creator'].length <= 1)
        this.creator = " ";
      else
        this.creator = res['creator'];

      this.documentService.setMaxPageDocument(res['nPages']);
      this.bottomMenuComponent.maxValuePage = this.documentService.getMaxPageDocument();
      this.originalHeight = Math.round(res['nativeSize'][1][1]);
      this.originalWidth  = Math.round(res['nativeSize'][1][0]);
      
    });
  }

  createImageFromBlob(image: Blob) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
        this.contentComponent.setImage(reader.result);
      }, false
    );
    if (image) {
       reader.readAsDataURL(image);
    }
  }

  getImage(nrPage: number, angle: number, maxWidth: number, maxHeight: number) {
    this.documentService.getImageFromPage(nrPage, angle, maxWidth, maxHeight).subscribe(data => {
      this.createImageFromBlob(data);
    });
  }

  downloadFile(){
    this.documentService.downloadDocument().subscribe(res => {
      var url = window.URL.createObjectURL(res);    
      var a = document.createElement('a');
      document.body.appendChild(a);
      a.setAttribute('style', 'display: none');
      a.href = url;
      a.download = this.title;
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    });
  }

  onResized(event: ResizedEvent): void {  //TODO resize? 
    if( event.newWidth > 0 &&  event.newHeight > 0 && !this.firstRendering){
      this.contentWidth = event.newWidth ;
      this.contentHeight = event.newHeight - 230;
      console.log("Width2: "+this.contentWidth+" \nHeight2: "+this.contentHeight);
      this.firstRendering = true;
      this.getImage(this.currentPage, this.anglePage, this.contentWidth, this.contentHeight);
    }
    this.maxWidth = event.newWidth - 100;
    this.maxHeight = event.newHeight - 230;
    console.log("MaxWidth: "+this.maxWidth+" \MaxHeight: "+this.maxHeight);
  }

  
}
