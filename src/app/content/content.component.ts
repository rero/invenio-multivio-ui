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
  ratio = 1;
  currentPage = 0;
  imgWidth = 0;
  imgHeight = 0;
  angle = 180;

  constructor() { }

  ngOnInit() { }

  // Display the image
  setImage(image: Blob) {
    this.imageToShow = image;
  }

  // SetBBox of the documet
  setBBox(bboxes: any) {
    this.allBBox = bboxes['BBox'];
  }

  // Reset the box after the research
  resetBbox() {
    this.bboxes = [];
  }

  // Set ration zoom
  setInfoPage(ratio: number, currentPage: number, angle: number) {
    this.angle = angle;
    this.resetBbox();
    this.ratio = ratio;
    this.currentPage = currentPage;
    this.getBBoxByPage();
  }

  // Get the bboes on current page
  getBBoxByPage() {
    if (this.allBBox !== []) {
      this.allBBox.forEach(element => {
        // Get only bboxes of actual page
        if (element.page === this.currentPage) {
          this.bboxes.push(element);
        }
      });
    }
  }

  // On resized event , called after resize content
  onResized(event: ResizedEvent): void {
    if (event.newHeight > 0 && event.newWidth > 0) {
      // Setting info about the actual size
      this.imgHeight = event.newHeight;
      this.imgWidth = event.newWidth;
    }
  }

}
