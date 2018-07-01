import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularResizedEventModule } from 'angular-resize-event';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgZorroAntdModule, NZ_I18N, fr_FR } from 'ng-zorro-antd';
import { registerLocaleData } from '@angular/common';
import fr from '@angular/common/locales/fr';
import { BottomMenuComponent } from './bottom-menu/bottom-menu.component';
import { ContentComponent } from './content/content.component';
import { MultivioLayoutComponent } from './multivio-layout/multivio-layout.component';
import { CollapsedMenuComponent } from './collapsed-menu/collapsed-menu.component';
import { DocumentService } from './document.service';
import { UrlPrefixService } from './url-prefix.service';


registerLocaleData(fr);

@NgModule({
  declarations: [
    AppComponent,
    BottomMenuComponent,
    ContentComponent,
    MultivioLayoutComponent,
    CollapsedMenuComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    NgZorroAntdModule,
    AngularResizedEventModule
  ],
  providers: [DocumentService, UrlPrefixService, { provide: NZ_I18N, useValue: fr_FR }],
  bootstrap: [AppComponent]
})
export class AppModule { }
