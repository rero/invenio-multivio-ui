import { Component, OnInit , ViewChild, Input} from '@angular/core';
import { CollapsedMenuComponent } from '../collapsed-menu/collapsed-menu.component';
import { BottomMenuComponent } from '../bottom-menu/bottom-menu.component';
import { DocumentService } from '../document.service';
import { Menu } from '../menu.enum';

@Component({
  selector: 'app-multivio',
  templateUrl: './multivio-layout.component.html',
  styleUrls: ['./multivio-layout.component.css']
})
export class MultivioLayoutComponent implements OnInit {

  @Input() urlDocument: string;
  @ViewChild(CollapsedMenuComponent)
  private menuComponent: CollapsedMenuComponent;
  @ViewChild(BottomMenuComponent)
  private bottomMenuComponent: BottomMenuComponent;
  Menu = Menu;
  isCollapsed: boolean = false;
  isReverseArrow: boolean = false;
  width: number  = 200;
  title: string = "";
  creator: string = "";

  constructor(private documentService:DocumentService) { 
    
  }

  ngOnInit() {
    this.onLoad();
  }

  onMenuClick(e:Menu) {
    this.menuComponent.collapse(e);
  }

  toggleBottomMenu(){
    this.bottomMenuComponent.toggleVisibility()
  }

  onLoad(){
    this.documentService.getMetadata(this.urlDocument)
    .subscribe(res => {
      if(res['title'].length <= 1)
        this.title = " ";
      else
        this.title = res['title'];

      if(res['creator'].length <= 1)
        this.creator = " ";
      else
        this.creator = res['creator'];
    });
  }
}
