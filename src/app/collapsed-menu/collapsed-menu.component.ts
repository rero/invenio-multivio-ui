import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { trigger,state,style,transition,animate } from '@angular/animations';
import { NzTreeNode } from 'ng-zorro-antd';
import { DocumentService } from '../document.service';
import { Menu } from '../menu.enum';

@Component({
  selector: 'app-collapsed-menu',
  templateUrl: './collapsed-menu.component.html',
  styleUrls: ['./collapsed-menu.component.css'],
  animations: [
    trigger('collapseAnimation', [
        state('true', style({
            width: '300px',
        })),
        state('false', style({
            width: '0px',
        })),
        transition('* => *', animate('200ms'))
    ]),
  ]
})
export class CollapsedMenuComponent implements OnInit {

  collapsed: boolean = false ;
  nodes: Array<Object> = [];
  counter: number = 0;
  actualMenu: number = 99;
  Menu = Menu;
  infoTocRetrieved: boolean = false;
  @Output() toggleMenu = new EventEmitter();
  @Input() urlDocument: string;
  
  constructor(private documentService:DocumentService) { }

  data: any[] = [];
  loading = false;
  hasMore = true;

  ngOnInit() {
    
  }

  collapse(e:Menu) {
    this.dispatchMenu(e)
    if(this.actualMenu == 99)
      this.actualMenu = e;
    if(e != Menu.AfficherMenu && e != Menu.Telecharger){
      if(this.actualMenu == e || !this.collapsed && this.actualMenu != e){
        this.collapsed = !this.collapsed;
      }
    }
    else{
      if(e == Menu.AfficherMenu)
        this.toggleBottomMenu();
      else if(e == Menu.Telecharger)
        this.downloadFile();
      this.collapsed = false; 
    }
    this.actualMenu = e;
  }

  toggleBottomMenu(){
    this.toggleMenu.emit();
  }

  downloadFile(){

  }

  mouseActionMenu(e: any): void {
    console.log(e.node.origin);
  }

  asChildren (val: Object, node: Object){
    if(val.hasOwnProperty('childs'))
    { 
      let childs = val['childs']
      for (let i = 0; i < childs.length; i++) {
        let subNode = {
          title : childs[i]['label'],
          key : (this.counter++).toString(),
          page : childs[i]['page_number']
        }
        if(!node.hasOwnProperty('children'))
          node['children'] = []
        node['children'].push(subNode);
        this.asChildren( childs[i],subNode);
      }
    }
  }

  dispatchMenu(option: number):void {
    switch (option) {
      case Menu.Structure:
        if(!this.infoTocRetrieved){
          this.documentService.getTOC(this.urlDocument)
          .subscribe(res => {
            for (let i = 0; i < res.length; i++) {
              let a = {
                title : res[i]['label'],
                key : (this.counter++).toString(),
                page: res[i]['file_position']['index']
              }
              this.asChildren(res[i], a);
              this.nodes.push(new NzTreeNode(a));
            }
            this.infoTocRetrieved = true;
          });
        }
        break;  
      default:
        break;
    }
  }

  getInputSearch(input:string) {
    console.log(input);
    
    this.documentService.findText(input,this.urlDocument)
    .subscribe(res => {
      console.log(res);
    });
  }

}
