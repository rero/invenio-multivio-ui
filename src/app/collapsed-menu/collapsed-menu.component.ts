import { Component, OnInit, Output, EventEmitter } from '@angular/core';
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

  @Output() pageChanged = new EventEmitter();
  

  inputValue: string = "";
  collapsed: boolean = false ;
  nodes: Array<Object> = [];
  counter: number = 0;
  actualMenu: number = 99;
  Menu = Menu;
  infoTocRetrieved: boolean = false;
  resultsSearch: any[] = [];
  sizeResultsSearch: number = 0;
  loading = false;
  hasMore = true;
  urlDownload: string;

  constructor(private documentService:DocumentService) { }

  ngOnInit(){

  }

  collapse(e:Menu) {
    this.dispatchMenu(e)
    if(this.actualMenu == 99)
      this.actualMenu = e;
    if(this.actualMenu == e || !this.collapsed && this.actualMenu != e){
      this.collapsed = !this.collapsed;
    }
    this.actualMenu = e;
  }

  mouseActionMenu(e: any): void {
    this.getPage(e.node.origin.page);
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
          this.documentService.getTOC()
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
    this.documentService.findText(input)
    .subscribe(res => {
      this.sizeResultsSearch = res.length;
      this.resultsSearch = res;
      for(let i = 0; i<res.length; i++){   //TODO
        let startString = this.resultsSearch[i]["text"];
        let endString = startString.replace(input, '<b>'+input+'</b>')
        this.resultsSearch[i]["text"] = endString;    
      }
    });
  }

  getPage(nrPage: number){ 
    this.pageChanged.emit({"Page":nrPage,"Angle": 0});
  }

  clearResults(){ 
    this.resultsSearch = [];
    this.inputValue = null;
  }

}