import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { NzTreeNode } from 'ng-zorro-antd';
import { DocumentService } from '../services/document.service';
import { ImageService } from '../services/image.service';
import { BaseService } from '../services/base.service';
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
  inputValue = '';
  collapsed = false ;
  nodesTOC: Array<Object> = [];
  counter = 0;
  actualMenu = 99;
  infoTocRetrieved = false;
  thumbnailsRetrieved = false;
  resultsSearch: any[] = [];
  thumbList: any[] = [];
  sizeResultsSearch = 0;
  thumbListMaxIndex = 8;
  modeViewThumb = 'list';
  typeObject: string ;
  searchDone = false;
  liClicked = -1;
  urlActualDoc = '';
  sizeTOC = 0;
  nbrDocs = 0;
  hasMixedObjects = false;
  keyExpanded = '0';

  constructor(private documentService: DocumentService, private imageService: ImageService, private baseService: BaseService) { }

  ngOnInit() { }

  // Display or hide the menu
  collapse(e: Menu, type: string, mixed: boolean) {
    this.hasMixedObjects = mixed;
    this.typeObject = type;
    // Dipatch the action on click
    this.dispatchMenu(e);
    if (this.actualMenu === 99) {
      this.actualMenu = e;
    }
    // Diplay, hide collapsed menu
    if (this.actualMenu === e || !this.collapsed && this.actualMenu !== e) {
      this.collapsed = !this.collapsed;
    }
    this.actualMenu = e;
  }

  // Display the page from TOC
  onClickTree(e: any): void {
    this.getPage(Number(e.node.origin.page), Number(e.node.origin.doc));
  }

  // Check if node as children's (recursive) to construct the tree
  asChildren (val: Object, node: Object, index: number){
    if (val.hasOwnProperty('childs')) {
      const childs = val['childs'];
      for (let i = 0; i < childs.length; i++) {
        const subNode = {
          title : childs[i]['label'],
          key : (this.counter++).toString(),
          doc: index,
          page : childs[i]['page_number']
        };
        if (!node.hasOwnProperty('children')) {
          node['children'] = [];
        }
        node['children'].push(subNode);
        this.asChildren( childs[i], subNode, index);
      }
    }
    else{
      node['isLeaf'] = true;
    }
  }

  // Dipatch click menu to correct fonctionality
  dispatchMenu(option: number): void {
    switch (option) {
      case Menu.TOC:
        this.getTOC();
        break;
      case Menu.ThumbPreview:
        this.getThumbsPreview();
        break;
    }
  }

  // Retrieve the table of contents of documents if exists
  getTOC() {
    if (!this.infoTocRetrieved) {
      let res;
      this.nbrDocs = Object.keys(this.baseService.getPhysicalInMemory()).length;
      for (let i = 0; i < this.nbrDocs; i++) {
        this.typeObject = this.baseService.getListTypeObjects()[i];
        res = this.baseService.getPhysicalInMemory()[i];
        switch (this.typeObject) {
          // We have 2 modes PDF or Image
          case Type.PDF:
            // Retrieve TOC from PDF
            this.urlActualDoc = this.baseService.getUrlCurrenObject();
            this.parseTocPDF(res, i);
            // Restore information about actual docment
            this.baseService.setUrlCurrentObject(this.urlActualDoc);
            this.infoTocRetrieved = true;
            break;
          case Type.Image:
            if( i == 0 )
              this.keyExpanded = (this.counter).toString();
            const node = {
              title: res['label'],
              key: (this.counter++).toString(),
              doc: i,
              page: i + 1
            };
            this.nodesTOC[i] = new NzTreeNode(node);
            this.sizeTOC = Object.keys(this.nodesTOC).length;
            this.infoTocRetrieved = true;
            break;
        }
      }
    }
  }

  // Get the thumbslist, 8 at first loading or less if document as not 8 elements
  getThumbsPreview() {
    if (!this.thumbnailsRetrieved) {
      if (this.thumbListMaxIndex > this.baseService.getMaxPage()) {
        this.thumbListMaxIndex = this.baseService.getMaxPage();
      }
      for (let page = 1; page <= this.thumbListMaxIndex; page++) {
        this.getThumbImages(page);
      }
      this.thumbnailsRetrieved = true;
    }
  }

  // Search text in document (only for PDF)
  getInputSearch(input: string) {
    this.documentService.findText(input)
    .subscribe(res => {
      this.searchDone = true;
      this.sizeResultsSearch = res.length;
      this.resultsSearch = res;
      if (this.sizeResultsSearch > 0) {
        for (let i = 0; i < res.length; i++) {
          const startString = this.resultsSearch[i]['text'];
          // Put word in bold
          const reg = new RegExp(input, 'i');
          const endString = startString.slice(0, startString.search(reg)) +
            '<b>' +
            startString.slice(startString.search(reg), startString.search(reg) + input.length) +
            '</b>' +
            startString.slice(startString.search(reg) + input.length);
          this.resultsSearch[i]['text'] = endString;
          // Adding for tooltip
          this.resultsSearch[i]['toolTip'] = startString;
        }
      } else {
        // Send BBox info at parent (in this case no results fournd)
        this.searchItemClick.emit({ 'BBox': this.resultsSearch });
      }
    });
  }

  // Clearing results to put all by default
  clearResults() {
    this.resultsSearch = [];
    this.inputValue = null;
    this.searchDone = false;
    this.liClicked = -1;
    this.searchItemClick.emit({ 'BBox': this.resultsSearch });
  }

  // Emit message to parent about the page
  getPage(nrPage: number, doc: number) {
    this.pageChanged.emit({'Page': nrPage, 'Angle': 0, 'Doc': doc});
  }

  // Click on list result of search
  resultClick(result: any, liNumberClick: number) {
    this.liClicked = liNumberClick;
    // Send info about search to display
    this.resultsSearch.forEach(element => {
      // Setting element selected as true for highlight in content component
      if (element.text === result.text) {
        element['selected'] = true;
      } else {
        element['selected'] = false;
      }
    });
    // Dislay the page
    this.getPage(result.page, null);
    // Send info about the bbox
    this.searchItemClick.emit({ 'BBox': this.resultsSearch});
  }

  // When last thumb is displayed call to the next thumbs from server
  onIntersection(event: any) {
    if (Number(event.target.id) === this.thumbListMaxIndex
        && Boolean(event.visible) === true
        && this.thumbListMaxIndex < this.baseService.getMaxPage()) {
      this.thumbListMaxIndex++;
      this.getThumbImages(this.thumbListMaxIndex);
    }
  }

  // Retrieve the thumbs images
  getThumbImages(page: number) {
    switch (this.typeObject) {
      // Mode PDF
      case Type.PDF:
        this.documentService.getImageFromDocument(page, 0, 150, 150)
          .subscribe(thumb => {
            const reader = new FileReader();
            reader.addEventListener('load', () => {
              this.thumbList[page - 1] = reader.result;
              }, false
            );
            if (thumb) {
              reader.readAsDataURL(thumb);
            }
        });
        break;
      // Mode Image
      case Type.Image:
        if (this.hasMixedObjects) {
          this.baseService.setUrlCurrentObject(this.baseService.getUrlCurrenObject());
        } else {
          const structure = this.baseService.getStructureObject();
          this.baseService.setUrlCurrentObject(structure[page - 1]['url']);
        }
        this.imageService.getImage(0, 150, 150)
          .subscribe(thumb => {
            const reader = new FileReader();
            reader.addEventListener('load', () => {
                this.thumbList[page - 1] = reader.result;
              }, false
            );
            if (thumb) {
              reader.readAsDataURL(thumb);
            }
        });
        break;
    }
  }

  // On Thumb selected display the correct page
  thumbSelected(page: number) {
    this.getPage(page, null);
  }

  // Mode display of thumb's (list or grid)
  modeView(mode: string) {
    this.modeViewThumb = mode;
  }

  // Reset thumb list
  resetThumbList() {
    this.thumbnailsRetrieved = false;
    this.thumbList = [];
  }

  parseTocPDF(res: Object, i: number) {
    this.baseService.setUrlCurrentObject(this.baseService.getStructureObject()[i]['url']);
    this.documentService.getTOC().subscribe(data => {
      if (i == 0)
        this.keyExpanded = (this.counter).toString();
      if (data !== null) {
        const node = {
          title: res['label'],
          key: (this.counter++).toString(),
          page: 1,
          doc: i,
          children: []
        };
        for (let j = 0; j < data.length; j++) {
          const subNode = {
            title: data[j]['label'],
            key: (this.counter++).toString(),
            doc: i,
            page: data[j]['file_position']['index']
          };
          this.asChildren(data[j], subNode, i);
          node['children'].push(subNode);
          
        }
        this.nodesTOC[i] = new NzTreeNode(node);
        this.sizeTOC = Object.keys(this.nodesTOC).length;
      } else {
        const node = {
          title: res['label'],
          key: (this.counter++).toString(),
          doc: i,
          page: 1,
        };
        this.nodesTOC[i] = new NzTreeNode(node);
        this.sizeTOC = Object.keys(this.nodesTOC).length;
      }
    });
  }

}
