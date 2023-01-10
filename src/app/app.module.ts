import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { WindowComponent } from './window/window.component';
import { TaskbarComponent } from './taskbar/taskbar.component';
import { StartMenuComponent } from './start-menu/start-menu.component';
import { DesktopComponent } from './desktop/desktop.component';

@NgModule({
  declarations: [
    AppComponent,
    WindowComponent,
    TaskbarComponent,
    StartMenuComponent,
    DesktopComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
