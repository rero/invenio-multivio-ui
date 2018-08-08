import { Component, OnInit , ViewChild, Input} from '@angular/core';
import { CollapsedMenuComponent } from '../collapsed-menu/collapsed-menu.component';
import { BottomMenuComponent } from '../bottom-menu/bottom-menu.component';
import { ContentComponent } from '../content/content.component';
import { DocumentService } from '../services/document.service';
import { ImageService } from '../services/image.service';
import { BaseService } from '../services/base.service';
import { Menu } from '../enum/menu.enum';
import { Display } from '../enum/display.enum';
import { Type } from '../enum/type.enum';
import { ResizedEvent } from 'angular-resize-event/resized-event';
import { NgZorroAntdModule } from 'ng-zorro-antd';


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
  isCollapsed = false;
  isReverseArrow = false;
  width  = 200;
  title = '';
  creator = '';
  contentHeight = 0;
  contentWidth = 0;
  maxHeight = 0;
  maxWidth = 0;
  originalHeight = 0;
  originalWidth = 0;
  currentPage = 1;
  anglePage = 0;
  firstRendering = false;
  typeObject = '';
  hasMixedObjects = false;
  isLoading = true;
  currentDocument = 0;
  ratioPage = 0;
  documentChanged = false;
  modeBack = false;

  constructor(private documentService: DocumentService, private imageService: ImageService, private baseService: BaseService) { }

  ngOnInit() {
    // Setting url metadata (JSON or XML )
    this.baseService.setUrl(this.url);
    // Get metadata Json
    this.setMetada();
  }

  // Getting info from JSON
  setMetada() {
    this.baseService.getMetadata().subscribe(res => {
      // Set type of object
      this.baseService.setListTypeObjects(res['mime_docs']);
      this.hasMixedObjects = !res['mime_docs'].reduce(function (a, b) { return (a === b) ? a : NaN; });
      this.typeObject = this.baseService.getListTypeObjects()[0];
      // Setting title info
      this.title = res['title'];
      // Setting creator info
      this.creator = res['creator'][0];
      this.setPhysical(0);
      }
    );
  }

  // Getting physical info from JSON
  setPhysical(docNumber: number) {
    this.baseService.getPhysical().subscribe(data => {
      this.baseService.setPhysicalInMemory(data);
      // Check if we are working with multiples documents/image at same time
      const nbDoc = Object.keys(data).length;
      if (nbDoc > 1 && this.hasMixedObjects || this.typeObject === Type.PDF) {
        this.baseService.setAsMultipleObjects(true);
        this.bottomMenuComponent.setNumberDocs(nbDoc);
        this.bottomMenuComponent.setCurrentDoc(docNumber);
      }
      // By default we set the first document/image
      this.baseService.setStructureObject(data);
      this.baseService.setUrlCurrentObject(data[docNumber]['url']);
      this.loadMetadata();
    });
  }

  // Dipspatch click on menu
  onMenuClick(e: Menu) {
    if (e !== Menu.BottomMenuVisible && e !== Menu.Download) {
      this.collapsedMenuComponent.collapse(e, this.typeObject, this.hasMixedObjects);
    } else {
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

  // Toggle the visibility of the bottom menu
  toggleBottomMenu() {
    this.bottomMenuComponent.toggleVisibility();
  }

  // Update image for rendering
  updateImage(event: Object) {
    console.log(event);
    
    // Resetting bboxes
    this.contentComponent.resetBbox();
    // Start spinner loading
    this.setSpinnerLoading(true);
    // Set actual doc in application
    if (event['Doc'] !== null) {
      if (event['Doc'] !== this.currentDocument) {
        // If we have changed the we reitialize the thumlist preview
        this.collapsedMenuComponent.resetThumbList();
        this.currentDocument = event['Doc'];
        this.documentChanged = true;
        this.collapsedMenuComponent.clearResults();
        this.bottomMenuComponent.setCurrentDoc(event['Doc']);
        this.typeObject = this.baseService.getListTypeObjects()[event['Doc']];
        this.collapsedMenuComponent.typeObject = this.typeObject;
      }
    }
    // Setting the angle
    this.anglePage = event['Angle'];
    // Manage event display
    switch (event['Display']) {
      case Display.ZoomIn:
        // By default zoom-in is set to + 20%
        this.contentWidth = Math.round(this.contentWidth + this.contentWidth / 100 * 20);
        this.contentHeight = Math.round(this.contentHeight + this.contentHeight / 100 * 20);
        break;
      case Display.ZoomOut:
        // By default zoom-ou is set to - 20%
        this.contentWidth = Math.round(this.contentWidth - this.contentWidth / 100 * 20);
        this.contentHeight = Math.round(this.contentHeight - this.contentHeight / 100 * 20);
        break;
      case Display.FitToWidth:
        if(this.anglePage == 90 || this.anglePage == 270){
          this.contentWidth = Math.round(this.maxWidth * this.ratioPage);
          // Calculating height with ratio
          this.contentHeight = this.maxWidth;
        }
        else{
          this.contentWidth = this.maxWidth;
          // Calculating height with ratio
          this.contentHeight = Math.round(this.maxWidth * this.ratioPage);
        }
        break;
      case Display.FitToHeight:
        if (this.anglePage == 90 || this.anglePage == 270) {
          this.contentHeight = Math.round(this.maxHeight * this.ratioPage);
          // Calculating with with ratio
          this.contentWidth = this.maxWidth;
        }
        else {
        this.contentHeight = this.maxHeight;
        // Calculating with with ratio
        this.contentWidth = Math.round(this.maxHeight / this.ratioPage);
        }
        break;
      case Display.OriginalSize:
        // Set content to original sizes
        this.contentWidth = this.originalWidth;
        this.contentHeight = this.originalHeight;
        break;
    }
    // Update info about current page
    this.bottomMenuComponent.currentPage = event['Page'];
    this.currentPage = event['Page'];
    // If we are working with multiples documents, set the new document
    if (this.baseService.getAsMultipleObjects() && this.documentChanged) {
      // Get image from document
      if (this.typeObject === Type.PDF || this.hasMixedObjects) {
        this.baseService.setUrlCurrentObject(this.baseService.getStructureObject()[this.currentDocument]['url']);
      }
      // Loading news metadata of docuement
      if (event['IsBack']) {
        // Retrive info from children's
        this.modeBack = true;
        this.bottomMenuComponent.currentPage = event['Page'];
        this.currentPage = event['Page'];
      }
      this.loadMetadata();
    } else {
      // Setting the current object (mode image)
      if (!this.hasMixedObjects && this.typeObject === Type.Image) {
        this.baseService.setUrlCurrentObject(this.baseService.getStructureObject()[this.currentPage - 1]['url']);
      }
      // Set info for mode search
      this.contentComponent.setInfoPage(this.contentHeight / this.originalHeight, this.currentPage, this.anglePage);
      // Set image
      this.setImageContent();
    }
  }

  // Load info abaout the document (ex. ssizes, number pages, ..)
  loadMetadata() {
    switch (this.typeObject) {
      case Type.PDF:
        // Get metadata from object of type PDF
        this.documentService.getMetadataDocument().subscribe(res => {
          this.baseService.setMaxPage(res['nPages']);
          this.bottomMenuComponent.maxValuePage = this.baseService.getMaxPage();
          this.originalHeight = Math.round(res['nativeSize'][0][1]);
          this.originalWidth  = Math.round(res['nativeSize'][0][0]);
          this.ratioPage = this.originalHeight / this.originalWidth;
          if (this.modeBack) {
            this.currentPage = this.baseService.getMaxPage();
            this.bottomMenuComponent.currentPage = this.currentPage;
          }
          if (this.documentChanged === true && this.collapsedMenuComponent.collapsed && this.collapsedMenuComponent.actualMenu === 2) {
            this.collapsedMenuComponent.getThumbsPreview();
          }
          // Set image
          this.setImageContent();
          // Set info for mode search
          this.contentComponent.setInfoPage(this.contentHeight / this.originalHeight, this.currentPage, this.anglePage);
          this.documentChanged = false;
          this.modeBack = false;
        }
      );
        break;
      case Type.Image:
        // Get metadata from object of type image/jpeg
        this.imageService.getMetadataImage().subscribe(res => {
          if (this.hasMixedObjects) {
            this.baseService.setMaxPage(1);
          } else {
            this.baseService.setMaxPage(this.baseService.getStructureObject().length);
          }
          this.bottomMenuComponent.maxValuePage = this.baseService.getMaxPage();
          this.originalHeight = Math.round(res['nativeSize'][1]);
          this.originalWidth  = Math.round(res['nativeSize'][0]);
          this.ratioPage = this.originalHeight / this.originalWidth;
          if (this.documentChanged === true && this.collapsedMenuComponent.collapsed && this.collapsedMenuComponent.actualMenu === 2) {
            this.collapsedMenuComponent.getThumbsPreview();
          }
          // Set image
          this.setImageContent();
          // Set info for mode search
          this.contentComponent.setInfoPage(this.contentHeight / this.originalHeight, this.currentPage, this.anglePage);
          this.documentChanged = false;
          this.modeBack = false;
        });
        break;
    }
  }

  // Fontion to download
  download() {
    switch (this.typeObject) {
      case Type.PDF:
        // Download PDF
        this.documentService.downloadDocument().subscribe(data => {
          this.createObjectURL(data);
        });
        break;
      case Type.Image:
        // Download the image
        this.imageService.downloadImage().subscribe(data => {
          this.createObjectURL(data);
        });
        break;
    }
  }

  // Create URL for downloading the element
  createObjectURL(data: Blob) {
    const url = window.URL.createObjectURL(data);
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.setAttribute('style', 'display: none');
    a.href = url;
    a.download = this.baseService.getPhysicalInMemory()[this.currentDocument]['label'];
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }

  // On resized event , called after resize content
  onResized(event: ResizedEvent): void {  // TODO resize?  call getPage? Attention of kind of object
    if ( event.newWidth > 0 &&  event.newHeight > 0 && !this.firstRendering) {
      this.contentWidth = event.newWidth - 100;
      this.contentHeight = event.newHeight - 235;
      this.firstRendering = true;
      // this.setImageContent();
    }
    this.maxWidth = event.newWidth - 100;
    this.maxHeight = event.newHeight - 235;
  }

  // Set image to render
  setImageContent() {
    switch (this.typeObject) {
      case Type.PDF:
        this.documentService.getImageFromDocument(this.currentPage, this.anglePage, this.contentWidth, this.contentHeight)
        .subscribe(data => {
          this.createImageFromBlob(data);
          this.setSpinnerLoading(false);
        });
        break;
      case Type.Image:
        this.imageService.getImage(this.anglePage, this.contentWidth, this.contentHeight).subscribe(data => {
          this.createImageFromBlob(data);
          this.setSpinnerLoading(false);
        });
      break;
    }
  }

  // Create image from blob retrieved (server)
  createImageFromBlob(image: Blob) {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
        this.contentComponent.setImage(reader.result);
    }, false );
    if (image) {
       reader.readAsDataURL(image);
    }
  }

  // Displaing box on document
  displayBoxSearch(res: any) {
    this.contentComponent.setBBox(res);
    this.contentComponent.setInfoPage(this.contentHeight / this.originalHeight, this.currentPage, this.anglePage);
  }

  // Stop spinner loading
  setSpinnerLoading(loading: boolean) {
    this.isLoading = loading;
  }
}
