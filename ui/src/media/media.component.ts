import { Component } from '@angular/core';
import { APIService } from '../services/api.service';
import { MediaItem } from '@models/MediaItem';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    templateUrl: './media.component.html'
})
export class MediaComponent {
    mediaItems: MediaItem = null;
    objectId: string = "";

    constructor(private apiService: APIService, private toastr: ToastrService) {
    }

    ngOnInit(){
    }

    LoadMedia(){
        if (!this.objectId){
            this.toastr.error("enter an object ID");
            return;
        }
        this.apiService.getMediaById(this.objectId).subscribe(result => {
            this.toastr.success("media loaded");
            this.mediaItems = result;
        }, (err: HttpErrorResponse ) => {
            this.toastr.error(err.error, "server error");
        })
    }
}
