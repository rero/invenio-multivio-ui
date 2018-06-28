import { Component, OnInit , ViewChild, Input} from '@angular/core';
import { CollapsedMenuComponent } from '../collapsed-menu/collapsed-menu.component';
import { BottomMenuComponent } from '../bottom-menu/bottom-menu.component';
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

  constructor() { }

  ngOnInit() {
  }

  onMenuClick(e:Menu) {
    this.menuComponent.collapse(e);
  }

  toggleBottomMenu(){
    this.bottomMenuComponent.toggleVisibility()
  }

  

}
