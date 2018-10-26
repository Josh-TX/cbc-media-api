import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { RouterModule } from '@angular/router'
import { RouteConfig } from './app.routes';
import { MediaComponent } from './media/media.component';
import { UploadComponent } from './upload/upload.component';
import { AboutComponent } from './about/about.component';
import { APIService } from './services/api.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
    declarations: [
        AppComponent,
        NavbarComponent,
        MediaComponent,
        UploadComponent,
        AboutComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpClientModule,
        BrowserAnimationsModule,
        RouterModule.forRoot(RouteConfig, { useHash: true }),
        ToastrModule.forRoot({
            timeOut: 3000,
            positionClass: 'toast-bottom-right',
            preventDuplicates: true,
        })
    ],
    providers: [
        APIService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
