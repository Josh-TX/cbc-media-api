import { HttpClient } from '@angular/common/http'
import { Routes } from '@angular/router'
import { AppComponent } from './app.component';
import { MediaComponent } from './media/media.component';
import { UploadComponent } from './upload/upload.component';
import { AboutComponent } from './about/about.component';

export let RouteConfig: Routes = [
    {path: '', pathMatch: 'full', redirectTo: 'media'},
    {path: 'media', pathMatch: 'full', component: MediaComponent},
    {path: 'upload', pathMatch: 'full', component: UploadComponent},
    {path: 'about', pathMatch: 'full', component: AboutComponent}
]