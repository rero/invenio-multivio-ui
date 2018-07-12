import { Component, OnInit } from '@angular/core';
import { ResizedEvent } from 'angular-resize-event/resized-event'; 

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
  imgWidth: number = 0;
  imgHeight: number = 0;
  angle: number = 180;

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
  setInfoPage(ratio: number, currentPage: number, angle: number){
    this.angle = angle;
    this.bboxes = [];
    this.ratio = ratio;
    this.currentPage = currentPage;
    this.getBBoxByPage();
    console.log("Angle: "+angle);
    
  }

  //Get the bboes on current page
  getBBoxByPage(){
    if(this.allBBox != []){
      this.allBBox.forEach(element => {
        if (element.page == this.currentPage) {
          this.bboxes.push(element);
        }
      });
    }
    console.log(this.bboxes);
    
  }

  //On resized event , called after resize content
  onResized(event: ResizedEvent): void {  
    if (event.newHeight > 0 && event.newWidth > 0){
      this.imgHeight = event.newHeight;
      this.imgWidth = event.newWidth;
      console.log(this.imgHeight);
      console.log(this.imgWidth);
    }
  }
  
}
