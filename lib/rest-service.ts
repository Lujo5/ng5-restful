import {HttpHeaders, HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import {Serializable} from './serializable';
import {BaseService} from './base-service';

export abstract class RestService<T extends Serializable, E> extends BaseService {
    protected httpService: HttpClient;
    private headers: HttpHeaders = new HttpHeaders({'Content-Type': 'application/json'});

    constructor(httpService: HttpClient) {
        super(httpService);
        this.httpService = httpService;
    }

    public query(parameters: any, path: string = null): Observable<T[]> {
        let finalPath = path != null ? path : this.getBaseUrlPath();
        return this.httpService.get(finalPath, this.generateRequestOptions(parameters, {}))
            .map((response: HttpResponse<T[]>) => response)
            .catch(this.handleError);
    }

    public getOne(id: number, path: string = null): Observable<T> {
        let finalPath = path != null ? path : this.getBaseUrlPath();
        const url = finalPath + (id != null ? '/' + id : '');
        return this.httpService.get(url)
            .map((response: HttpResponse<T>) => response)
            .catch(this.handleError);
    }

    public createOne(model: T, path: string = null): Observable<E> {
        let finalPath = path != null ? path : this.getBaseUrlPath();
        return this.httpService.post(finalPath, model.serialize(), {headers: this.headers})
            .map((response: HttpResponse<E>) => response)
            .catch(this.handleError);
    }

    public updateOne(model: T, path: string = null): Observable<E> {
        let finalPath = path != null ? path : this.getBaseUrlPath();
        return this.httpService.put(finalPath, model.serialize(), {headers: this.headers})
            .map((response: HttpResponse<E>) => response)
            .catch(this.handleError);
    }

    public deleteOne(id: number, path: string = null): Observable<E> {
        let finalPath = path != null ? path : this.getBaseUrlPath();
        const url = finalPath + (id != null ? '/' + id : '');
        return this.httpService.delete(url, {headers: this.headers})
            .map((response: HttpResponse<E>) => response)
            .catch(this.handleError);
    }

    abstract getBaseUrlPath(): string;
}
