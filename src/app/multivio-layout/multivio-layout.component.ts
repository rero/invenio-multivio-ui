import { Component, OnInit , ViewChild, Input} from '@angular/core';
import { CollapsedMenuComponent } from '../collapsed-menu/collapsed-menu.component';
import { BottomMenuComponent } from '../bottom-menu/bottom-menu.component';
import { ContentComponent } from '../content/content.component';
import { DocumentService } from '../document.service';
import { Menu } from '../menu.enum';

@Component({
  selector: 'app-multivio',
  templateUrl: './multivio-layout.component.html',
  styleUrls: ['./multivio-layout.component.css']
})
export class MultivioLayoutComponent implements OnInit {

 
  @ViewChild(CollapsedMenuComponent)
  private menuComponent: CollapsedMenuComponent;
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

  constructor(private documentService:DocumentService) { 
    
  }

  ngOnInit() {
    this.documentService.setUrlDocument(this.urlDocument);
    this.loadMetadata();
    this.getImage(1,0);
    
  }

  onMenuClick(e:Menu) {
    this.menuComponent.collapse(e);
  }

  toggleBottomMenu(){
    this.bottomMenuComponent.toggleVisibility()
  }

  updatePage(event: Object){
    this.bottomMenuComponent.currentValue = event["Page"];
    this.getImage(event["Page"], event["Angle"]);
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

  getImage(nrPage: number, angle: number) {
    this.documentService.getImageFromPage(nrPage, angle).subscribe(data => {
      this.createImageFromBlob(data);
    });
  }

  
}
