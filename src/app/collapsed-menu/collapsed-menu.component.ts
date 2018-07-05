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
  
  Menu = Menu;
  inputValue: string = "";
  collapsed: boolean = false ;
  nodesTOC: Array<Object> = [];
  counter: number = 0;
  actualMenu: number = 99;
  infoTocRetrieved: boolean = false;
  thumbnailsRetrieved: boolean = false;
  resultsSearch: any[] = [];
  thumbList: any[] = [];
  sizeResultsSearch: number = 0;
  thumbListMaxIndex: number = 8;
  modeViewThumb: string = 'list'

  constructor(private documentService:DocumentService) {
    
  }

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
      case Menu.TOC:
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
              this.nodesTOC.push(new NzTreeNode(a));
            }
            this.infoTocRetrieved = true;
          });
        }
        break;
      case Menu.ThumbPreview: 
        if(!this.thumbnailsRetrieved){
          if(this.thumbListMaxIndex > this.documentService.getMaxPageDocument()){
            this.thumbListMaxIndex = this.documentService.getMaxPageDocument()
          }
          for (let page = 1; page <= this.thumbListMaxIndex; page++) { 
             this.getThumbImages(page);
          } 
          this.thumbnailsRetrieved = true;
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
      for(let i = 0; i<res.length; i++){   
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

  onIntersection(event : any) {
    if(event.target.id == this.thumbListMaxIndex 
        && event.visible == true 
        && this.thumbListMaxIndex < this.documentService.getMaxPageDocument()){
      this.thumbListMaxIndex++;
      this.getThumbImages(this.thumbListMaxIndex);
    }
  }

  getThumbImages(page: number){
    this.documentService.getImageFromPage(page,0,150,150)
      .subscribe(thumb => {
        let reader = new FileReader();
        reader.addEventListener("load", () => {
            this.thumbList.push(reader.result);
          }, false
        );
        if (thumb) {
          reader.readAsDataURL(thumb);
        }
      });
  }

  thumbSelected(page: number){
    this.getPage(page); 
  }

  modeView(mode: string){
    this.modeViewThumb = mode;
  }

}
