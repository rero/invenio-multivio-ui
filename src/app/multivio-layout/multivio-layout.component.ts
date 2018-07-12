import { Component, OnInit , ViewChild, Input} from '@angular/core';
import { CollapsedMenuComponent } from '../collapsed-menu/collapsed-menu.component';
import { BottomMenuComponent } from '../bottom-menu/bottom-menu.component';
import { ContentComponent } from '../content/content.component';
import { DocumentService } from '../document.service';
import { Menu } from '../enum/menu.enum';
import { Display } from '../enum/display.enum';
import { Type } from '../enum/type.enum';
import { ResizedEvent } from 'angular-resize-event/resized-event';  

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

  @Input() url: string;

  Menu = Menu;
  Type = Type;
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
  typeObject: string = "";
  metadataInfo: any;
  isLoading: boolean = true;
  currentDocument: number = 0;
  ratioPage: number = 0;
  documentChanged: boolean = false;

  constructor(private documentService:DocumentService) { }

  ngOnInit() {
    //Setting url metadata (JSON or XML )
    this.documentService.setUrl(this.url);
    //Get metadata Json 
    this.setMetada();
  }

  //Getting info from JSON
  setMetada(){
    this.documentService.getMetadata().subscribe(res => {
      this.metadataInfo = res;
      //Set type of object
      this.typeObject = res['mime']
      //Setting title info
      this.title = res['title'];
      //Setting creator info
      this.creator = res['creator'][0];
      this.setPhysical(0);
      }
    ); 
  }

  //Getting physical info from JSON
  setPhysical(docNumber: number){
    this.documentService.getPhysical().subscribe(data => {
      //Check if we are working with multiples documents/image at same time
      if (Object.keys(data).length > 1){
        this.documentService.setAsMultipleOnjects(true);
      }
      //By default we set the first document/image
      this.documentService.setStructureObject(data);
      this.documentService.setUrlObject(data[docNumber]['url']);
      this.loadMetadata();
      this.setImageContent()
    });
  }

  //Dipspatch click on menu
  onMenuClick(e:Menu) {
    if(e != Menu.BottomMenuVisible && e != Menu.Download){
      this.collapsedMenuComponent.collapse(e, this.typeObject);
    }
    else{
      switch (e) {
        case Menu.BottomMenuVisible:
          this.toggleBottomMenu();
          break;
        case Menu.Download:
          this.download();
          break;
      }
    }
  }

  //Toggle the visibility of the bottom menu
  toggleBottomMenu(){
    this.bottomMenuComponent.toggleVisibility()
  }

  //Update image for rendering
  updateImage(event: Object){
    //Resetting bboxes
    this.contentComponent.resetBbox();
    //Start spinner loading
    this.setSpinnerLoading(true);
    //Retrive info from children's
    this.bottomMenuComponent.currentPage = event["Page"];
    this.currentPage = event["Page"];
    if(event["Doc"] != null){
      if (event["Doc"] != this.currentDocument){
        this.collapsedMenuComponent.resetThumbList();
        this.currentDocument = event["Doc"];
        this.documentChanged = true;
      }
    }
    this.anglePage = event["Angle"]
    //Manage event display
    switch (event["Display"]) {
      case Display.ZoomIn:
        this.contentWidth = Math.round(this.contentWidth + this.contentWidth / 100 * 20)
        this.contentHeight = Math.round(this.contentHeight + this.contentHeight / 100 * 20)
        break;
      case Display.ZoomOut:
        this.contentWidth = Math.round(this.contentWidth - this.contentWidth / 100 * 20)
        this.contentHeight = Math.round(this.contentHeight - this.contentHeight / 100 * 20)
        break;
      case Display.FitToWidth:
        this.contentWidth = this.maxWidth;
        this.contentHeight = Math.round(this.maxWidth * this.ratioPage);        
        break;
      case Display.FitToHeight:
        this.contentHeight = this.maxHeight;
        this.contentWidth = Math.round(this.maxHeight / this.ratioPage);
        break;
      case Display.OriginalSize:
        this.contentWidth = this.originalWidth;
        this.contentHeight = this.originalHeight;
        break;
    }
    //Set info for mode search
    this.contentComponent.setInfoPage(this.contentHeight / this.originalHeight, this.currentPage, this.anglePage); 
    //Set image
    this.setImageContent();
  }

  //Load info abaout the document (ex. ssizes, number pages, ..)
  loadMetadata(){
    switch (this.typeObject) {
      case Type.PDF:
        //Get metadata from object of type PDF
        this.documentService.getMetadataDocument().subscribe(res => {
          this.documentService.setMaxPage(res['nPages']);
          this.bottomMenuComponent.maxValuePage = this.documentService.getMaxPage();
          this.originalHeight = Math.round(res['nativeSize'][0][1]);
          this.originalWidth  = Math.round(res['nativeSize'][0][0]); 
          this.ratioPage = this.originalHeight / this.originalWidth;   
        });
        break;
      case Type.Image:
        //Get metadata from object of type image/jpeg
        this.documentService.getMetadataImage().subscribe(res => {
          this.documentService.setMaxPage(this.documentService.getStructureObject().length);
          this.bottomMenuComponent.maxValuePage = this.documentService.getMaxPage();
          this.originalHeight = Math.round(res['nativeSize'][1]);
          this.originalWidth  = Math.round(res['nativeSize'][0]);
          this.ratioPage = this.originalHeight / this.originalWidth;  
        });
        break;
    } 
  }

  //Fontion to download 
  download(){
    switch (this.typeObject){
      case Type.PDF:
        //Download PDF
        this.documentService.downloadDocument().subscribe(data => {
          this.createObjectURL(data);
        });
        break;
      case Type.Image:
        //Download the image
        this.documentService.downloadImage().subscribe(data => {
          this.createObjectURL(data);
        });
        break;
    }
  }

  //Create URL for downloading the element
  createObjectURL(data: Blob){
    var url = window.URL.createObjectURL(data);    
    var a = document.createElement('a');
    document.body.appendChild(a);
    a.setAttribute('style', 'display: none');
    a.href = url;
    a.download = this.title;
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }

  //On resized event , called after resize content
  onResized(event: ResizedEvent): void {  //TODO resize?  call getPage? Attention of kind of object
    if( event.newWidth > 0 &&  event.newHeight > 0 && !this.firstRendering){
      this.contentWidth = event.newWidth - 100;
      this.contentHeight = event.newHeight - 235;
      this.firstRendering = true;
      //this.setImageContent();
    }
    this.maxWidth = event.newWidth - 100;
    this.maxHeight = event.newHeight - 235;
  }

  //Set image to render
  setImageContent(){
    switch (this.typeObject) {
      case Type.PDF:
        if(this.documentService.getAsMultipleOnjects() && this.documentChanged){
          //Get image from document
          this.documentService.setUrlObject(this.documentService.getStructureObject()[this.currentDocument]['url']);
          //Loading news metadata of docuement
          this.loadMetadata();
          this.documentChanged = false;
        }
        this.documentService.getImageFromDocument(this.currentPage, this.anglePage, this.contentWidth, this.contentHeight).subscribe(data => {
          this.createImageFromBlob(data);
          this.setSpinnerLoading(false);
        });
        break;
      case Type.Image:
        this.documentService.setUrlObject(this.documentService.getStructureObject()[this.currentPage - 1]['url']);
        this.documentService.getImage(this.anglePage, this.contentWidth, this.contentHeight).subscribe(data => {
          this.createImageFromBlob(data);
          this.setSpinnerLoading(false);
        });        
      break;
    }
  }

  //Create image from blob retrieved (server)
  createImageFromBlob(image: Blob) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
        this.contentComponent.setImage(reader.result);
    }, false );
    if(image) {
       reader.readAsDataURL(image);
    }
  }

  //Displaing box on document
  displayBoxSearch(res: any){
    this.contentComponent.setBBox(res);
    this.contentComponent.setInfoPage(this.contentHeight / this.originalHeight, this.currentPage, this.anglePage);
  }

  //Stop spinner loading
  setSpinnerLoading(loading: boolean){
    this.isLoading = loading;
  }
}
