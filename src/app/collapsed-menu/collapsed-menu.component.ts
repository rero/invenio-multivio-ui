import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { trigger,state,style,transition,animate } from '@angular/animations';
import { NzTreeNode } from 'ng-zorro-antd';
import { DocumentService } from '../document.service';
import { Menu } from '../enum/menu.enum';
import { Type } from '../enum/type.enum';
import { logging } from 'protractor';
import { METHODS } from 'http';

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
  typeObject: string ;

  constructor(private documentService:DocumentService) { }

  ngOnInit(){ }

  //Display or hide the menu
  collapse(e: Menu, type: string) {
    this.typeObject = type;
    //Dipatch the action on click
    this.dispatchMenu(e)
    if(this.actualMenu == 99)
      this.actualMenu = e;
    //Diplay, hide collapsed menu
    if(this.actualMenu == e || !this.collapsed && this.actualMenu != e){
      this.collapsed = !this.collapsed;
    }
    this.actualMenu = e;
  }

  //Display the page from TOC
  onClickTree(e: any): void {
    this.getPage(e.node.origin.page, e.node.origin.doc);
    console.log(e.node.origin.doc);
    
  }

  //Check if node as children's (recursive)
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

  //Dipachch click menu to correct fonctionality
  dispatchMenu(option: number):void {
    switch (option) {
      case Menu.TOC:
        this.getTOC();
        break;
      case Menu.ThumbPreview: 
        this.getThumbsPreview();
        break;
    }
  }

  getTOC(){
    if(!this.infoTocRetrieved){
      switch (this.typeObject){
        case Type.PDF:
          //Retrieve TOC from PDF 
          this.documentService.getPhysicalJSON().subscribe(res => {
            for (let i = 0; i < Object.keys(res).length; i++) {
              this.documentService.setUrlObject(this.documentService.getStructureObject()[i]['url']);
              this.documentService.getTOC().subscribe(data => {
                if (data != null) {
                  let node = {
                    title: res[i]['label'],
                    key: (this.counter++).toString(),
                    page: 1,
                    doc: i,
                    children: []
                  }
                  for (let j = 0; j < data.length; j++) {
                    let a = {
                      title: data[j]['label'],
                      key: (this.counter++).toString(),
                      doc: i,
                      page: data[j]['file_position']['index']
                    }
                    this.asChildren(data[j], a);
                    node['children'].push(a);
                  }
                  this.nodesTOC.push(new NzTreeNode(node));
                }
                else {
                  let node = {
                    title: res[i]['label'],
                    key: (this.counter++).toString(),
                    doc: i,
                    page: 1,
                    children: []
                  }
                  this.nodesTOC.push(new NzTreeNode(node));
                }
              })
            }
          });
          this.infoTocRetrieved = true;
          break;
        case Type.Image:
          this.documentService.getPhysicalJSON().subscribe(res => {
            for (let i = 0; i < Object.keys(res).length; i++) {
              let node = {
                title: res[i]['label'],
                key: (this.counter++).toString(),
                page: i + 1
              }
              this.nodesTOC.push(new NzTreeNode(node));
            }
            this.infoTocRetrieved = true;
          });
          break;
        }
      }
     
  }

  getThumbsPreview(){
    if(!this.thumbnailsRetrieved){
      if(this.thumbListMaxIndex > this.documentService.getMaxPage()){
        this.thumbListMaxIndex = this.documentService.getMaxPage()
      }
      for (let page = 1; page <= this.thumbListMaxIndex; page++) { 
        console.log(page);
        console.log(this.documentService.getMaxPage());
        this.getThumbImages(page);
      } 
      this.thumbnailsRetrieved = true;
    }
  }

  //Search text in document (only for PDF)
  getInputSearch(input:string) {
    this.documentService.findText(input)
    .subscribe(res => {
      this.sizeResultsSearch = res.length;
      this.resultsSearch = res;
      for(let i = 0; i<res.length; i++){   
        let startString = this.resultsSearch[i]["text"];
        //Put word in bold
        let endString = startString.replace(input, '<b>'+input+'</b>')
        this.resultsSearch[i]["text"] = endString; 
        this.resultsSearch[i]["toolTip"] = startString;   
      }
    });
  }

  //Clearing results
  clearResults(){ 
    this.resultsSearch = [];
    this.inputValue = null;
  }

  //Emit message to parent about the page
  getPage(nrPage: number, doc: number){ 
    this.pageChanged.emit({"Page":nrPage, "Angle": 0, "Doc":doc});
  }

  //When last thumb is displayed call to the next thumb from server
  onIntersection(event : any) {
    if(event.target.id == this.thumbListMaxIndex 
        && event.visible == true 
        && this.thumbListMaxIndex < this.documentService.getMaxPage()){
      this.thumbListMaxIndex++;
      this.getThumbImages(this.thumbListMaxIndex);
    }
  }

  getThumbImages(page: number){
    switch (this.typeObject){
      case Type.PDF:
        this.documentService.getImageFromDocument(page,0,150,150)
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
        break;
      case Type.Image:
        let structure = this.documentService.getStructureObject();
        this.documentService.setUrlObject(structure[page-1]['url']);
        this.documentService.getImage(0,150,150)  
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
        break;
    }
  }

  //On Thumb selected display the correct page
  thumbSelected(page: number){
    this.getPage(page, null); 
  }

  //Mode display of thumb's (list or grid)
  modeView(mode: string){
    this.modeViewThumb = mode;
  }

  resetThumbList(){
    this.thumbnailsRetrieved = false;
    this.thumbList = [];
  }

}
