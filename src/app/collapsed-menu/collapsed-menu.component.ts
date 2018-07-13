import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { trigger,state,style,transition,animate } from '@angular/animations';
import { NzTreeNode } from 'ng-zorro-antd';
import { DocumentService } from '../document.service';
import { Menu } from '../enum/menu.enum';
import { Type } from '../enum/type.enum';

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
  @Output() searchItemClick = new EventEmitter();

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
  searchDone: boolean = false;
  liClicked: number = -1;
  urlActualDoc: string = "";
  sizeTOC: number = 0;
  nbrDocs: number = 0;

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
  }

  //Check if node as children's (recursive) to construct the tree
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

  //Dipatch click menu to correct fonctionality
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

  //Retrieve the table of contents of documents if exists
  getTOC(){
    if(!this.infoTocRetrieved){
      switch (this.typeObject){
        //We have 2 modes PDF or Image
        case Type.PDF:
          //Retrieve TOC from PDF 
          this.urlActualDoc = this.documentService.getUrlCurrenObject();
          this.documentService.getPhysical().subscribe(res => {
            this.nbrDocs = Object.keys(res).length;
            //Asking for the TOC of alls documents
            for (let i = 0; i < this.nbrDocs; i++) {
              this.documentService.setUrlCurrentObject(this.documentService.getStructureObject()[i]['url']);
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
                    let subNode = {
                      title: data[j]['label'],
                      key: (this.counter++).toString(),
                      doc: i,
                      page: data[j]['file_position']['index']
                    }
                    this.asChildren(data[j], subNode);
                    node['children'].push(subNode);
                  }
                  this.nodesTOC[i] = new NzTreeNode(node);
                  this.sizeTOC = Object.keys(this.nodesTOC).length;
                }
                else {
                  let node = {
                    title: res[i]['label'],
                    key: (this.counter++).toString(),
                    doc: i,
                    page: 1,
                    children: []
                  }
                  this.nodesTOC[i]=new NzTreeNode(node);
                  this.sizeTOC = Object.keys(this.nodesTOC).length;
                }
              })
            } 
            //Restore information about actual docment
            this.documentService.setUrlCurrentObject(this.urlActualDoc);
          });
          this.infoTocRetrieved = true;
          break;
        case Type.Image:
          this.documentService.getPhysical().subscribe(res => {
              this.nbrDocs = Object.keys(res).length;
              for (let i = 0; i < Object.keys(res).length; i++) {
                let node = {
                  title: res[i]['label'],
                  key: (this.counter++).toString(),
                  page: i + 1
                }
                this.nodesTOC[i] = new NzTreeNode(node);
                this.sizeTOC = Object.keys(this.nodesTOC).length;
              }
              this.infoTocRetrieved = true;
            });
          break;
        }
      }
  }

  //Get the thumbslist, 8 at first loading or less if document as not 8 elements
  getThumbsPreview(){
    if(!this.thumbnailsRetrieved){
      if(this.thumbListMaxIndex > this.documentService.getMaxPage()){
        this.thumbListMaxIndex = this.documentService.getMaxPage()
      }
      for (let page = 1; page <= this.thumbListMaxIndex; page++) { 
        this.getThumbImages(page);
      } 
      this.thumbnailsRetrieved = true;
    }
  }

  //Search text in document (only for PDF)
  getInputSearch(input:string) {
    this.documentService.findText(input)
    .subscribe(res => {
      this.searchDone = true;
      this.sizeResultsSearch = res.length;
      this.resultsSearch = res;
      if (this.sizeResultsSearch > 0) {
        for (let i = 0; i < res.length; i++) {
          let startString = this.resultsSearch[i]["text"];
          //Put word in bold 
          let endString = startString.replace(input, '<b>' + input + '</b>');
          this.resultsSearch[i]["text"] = endString;
          //Adding for tooltip
          this.resultsSearch[i]["toolTip"] = startString;
        }
      }
      else{
        //Send BBox info at parent (in this case no results fournd)
        this.searchItemClick.emit({ "BBox": this.resultsSearch });
      }
    });
  }

  //Clearing results to put all by default
  clearResults(){ 
    this.resultsSearch = [];
    this.inputValue = null;
    this.searchDone = false;
    this.liClicked = -1;
    this.searchItemClick.emit({ "BBox": this.resultsSearch });
  }

  //Emit message to parent about the page
  getPage(nrPage: number, doc: number){    
    this.pageChanged.emit({"Page":nrPage, "Angle": 0, "Doc":doc});
  }

  //Click on list result of search
  resultClick(result: any, liNumberClick: number){ 
    this.liClicked = liNumberClick;
    //Send info about search to display
    this.resultsSearch.forEach(element => {
      //Setting element selected as true for highlight in content component
      if (element.text == result.text)
        element['selected'] = true;
      else
        element['selected'] = false;
    });
    //Dislay the page 
    this.getPage(result.page, null);
    //Send info about the bbox
    this.searchItemClick.emit({ "BBox": this.resultsSearch});
  }

  //When last thumb is displayed call to the next thumbs from server
  onIntersection(event : any) {
    if(event.target.id == this.thumbListMaxIndex 
        && event.visible == true 
        && this.thumbListMaxIndex < this.documentService.getMaxPage()){
      this.thumbListMaxIndex++;
      this.getThumbImages(this.thumbListMaxIndex);
    }
  }

  //Retrieve the thumbs images
  getThumbImages(page: number){
    switch (this.typeObject){
      //Mode PDF
      case Type.PDF:
        this.documentService.getImageFromDocument(page,0,150,150)
          .subscribe(thumb => {
            let reader = new FileReader();
            reader.addEventListener("load", () => {
              this.thumbList[page - 1] = reader.result;
              }, false
            );
            if (thumb) {
              reader.readAsDataURL(thumb);
            }
        });
        break;
      //Mode Image
      case Type.Image:
        let structure = this.documentService.getStructureObject();
        this.documentService.setUrlCurrentObject(structure[page-1]['url']);
        this.documentService.getImage(0,150,150)  
          .subscribe(thumb => {
            let reader = new FileReader();
            reader.addEventListener("load", () => {
                this.thumbList[page-1] = reader.result;
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

  //Reset thumb list
  resetThumbList(){
    this.thumbnailsRetrieved = false;
    this.thumbList = [];
  }

}
