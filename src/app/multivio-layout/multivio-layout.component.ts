import { Component, OnInit , ViewChild, Input} from '@angular/core';
import { CollapsedMenuComponent } from '../collapsed-menu/collapsed-menu.component';
import { BottomMenuComponent } from '../bottom-menu/bottom-menu.component';
import { ContentComponent } from '../content/content.component';
import { DocumentService } from '../document.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Menu } from '../menu.enum';
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
  imageToShow: Blob;
  fileDownload;

  contentHeight: number = 0; 
  contentWidth: number = 0;
  currentPage: number= 1;
  anglePage: number = 0;
  firstRendering: boolean = false;

  constructor(private documentService:DocumentService,private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.documentService.setUrlDocument(this.urlDocument);
    this.loadMetadata();
    //this.getImage(this.currentPage, this.anglePage, this.contentWidth, this.contentHeight);
  }

  onMenuClick(e:Menu) {
    if(e != Menu.AfficherMenu && e != Menu.Telecharger){
      this.collapsedMenuComponent.collapse(e);
    }
    if(e == Menu.AfficherMenu)
        this.toggleBottomMenu();
      else if(e == Menu.Telecharger)
        this.downloadFile();
  }

  toggleBottomMenu(){
    this.bottomMenuComponent.toggleVisibility()
  }

  updatePage(event: Object){
    this.bottomMenuComponent.currentPage = event["Page"];
    this.currentPage = event["Page"]
    this.anglePage = event["Angle"]
    if(event["Zoom"] == "zoomIn"){
      this.contentWidth = Math.round(this.contentWidth +  this.contentWidth / 100 * 20)
      this.contentHeight = Math.round(this.contentHeight +  this.contentHeight / 100 * 20)
    }
    else if(event["Zoom"] == "zoomOut"){
      this.contentWidth = Math.round(this.contentWidth -  this.contentWidth / 100 * 20)
      this.contentHeight = Math.round(this.contentHeight -  this.contentHeight / 100 * 20)
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
      this.bottomMenuComponent.setMaxPage(res['nPages']);
    });
  }

  createImageFromBlob(image: Blob) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
       this.imageToShow = reader.result;
       this.contentComponent.setImage(this.imageToShow);
    }, false);
 
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
    console.log("Download");
    this.documentService.downloadDocument().subscribe(blob => {
      const data = 'some text';
      const blob2 = new Blob([data], { type: 'application/octet-stream' });
      this.fileDownload = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob2));
      //this.fileDownload = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));
    });
    
  }

  onResized(event: ResizedEvent): void {  //TODO resize? 
    this.contentWidth = event.newWidth ;
    this.contentHeight = event.newHeight - 230;

    if( this.contentWidth > 0 &&  this.contentHeight > 0 && !this.firstRendering){
      console.log("Width: "+this.contentWidth+" \nHeight: "+this.contentHeight);
      this.firstRendering = true;
      this.getImage(this.currentPage, this.anglePage, this.contentWidth, this.contentHeight);
    }
  }

  
}
