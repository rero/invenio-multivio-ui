import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})

export class ContentComponent implements OnInit {

  imageToShow: Blob ;
  bboxes: any = [];
  allBBox: any = [];
  ratio: number = 1;
  currentPage: number = 0;
  
  constructor() { }

  ngOnInit() { }

  //Display the image
  setImage(image: Blob){
    this.imageToShow = image;
  }

  //SetBBox in the documet
  setBBox(bboxes: any){
    this.allBBox = bboxes['BBox'];
  }

  //Reset the box after the research
  resetBbox(){
    this.bboxes = [];
  }

  //Set ration zoom
  setInfoPage(ratio: number, currentPage: number){
    this.bboxes = [];
    this.ratio = ratio;
    this.currentPage = currentPage;
    this.getBBoxByPage();
  }

  getBBoxByPage(){
    if(this.allBBox != []){
      this.allBBox.forEach(element => {
        if (element.page == this.currentPage) {
          this.bboxes.push(element);
        }
      });
    }
  }
  
}
