
import {of as observableOf,  Observable ,   } from 'rxjs';

import { HttpClient, HttpRequest, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { config } from '../app.config';
import { MediaItem } from '@models/MediaItem';
import { UpdateMediaRequest } from '@models/UpdateMediaRequest';
import { map } from 'rxjs/operators';

type AnyObject = {[key: string]: any}

@Injectable()
export class APIService {
    constructor(private http: HttpClient) {
        
    }

    private appendQueryParameters(params: HttpParams, obj: AnyObject): HttpParams {
        for (let key of Object.keys(obj)) {
            if (Array.isArray(obj[key])) {
                for (var i = 0; i < obj[key].length; i++) {
                    params = params.set(key + '[' + i + ']', obj[key][i]);
                }
            } else if (obj[key] !== undefined) {
                params = params.set(key, obj[key]);
            }
        }
        return params;
    }

    getMediaById(objectId: string): Observable<MediaItem>{
        return this.http.get( config.api + "media/" + objectId) as Observable<MediaItem>;
    }
}