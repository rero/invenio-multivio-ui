import { Component, Output, OnInit, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})

export class ContentComponent implements OnInit {

  imageToShow: Blob ;
  contentHeight: number;
  contentWidth: number;
  positionLeft: string;
  positionTop : string; 

  constructor() { }

  ngOnInit() {
     
  }

  setImage(image: Blob){
    this.imageToShow = image;
  }

  
}