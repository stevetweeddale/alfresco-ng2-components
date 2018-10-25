import { Injectable } from '@angular/core';
import {
    AlfrescoApiService,
    AppConfigService,
    LogService
} from '@alfresco/adf-core';
import { from, Observable, throwError } from 'rxjs';
import { StartTaskCloudRequestModel } from '../models/start-task-cloud-request.model';
import { TaskDetailsCloudModel, StartTaskCloudResponseModel } from '../models/task-details-cloud.model';
import { map, catchError } from 'rxjs/operators';
import { UserCloudModel } from '../models/user-cloud.model';

@Injectable()
export class StartTaskCloudService {

    constructor(
        private apiService: AlfrescoApiService,
        private appConfigService: AppConfigService,
        private logService: LogService
    ) {}

    createNewTask(taskDetails: TaskDetailsCloudModel): Observable<TaskDetailsCloudModel> {
        let queryUrl = this.buildCreateTaskUrl(taskDetails.appName);
        const bodyParam = JSON.stringify(this.buildRequestBody(taskDetails));
        const httpMethod = 'POST', pathParams = {}, queryParams = {}, headerParams = {},
            formParams = {}, authNames = [], contentTypes = ['application/json'], accepts = ['application/json'];

        return from(
            this.apiService
                .getInstance()
                .oauth2Auth.callCustomApi(
                    queryUrl, httpMethod, pathParams, queryParams,
                    headerParams, formParams, bodyParam, authNames,
                    contentTypes, accepts, Object, null, null)
                ).pipe(
                    map((response: StartTaskCloudResponseModel) => {
                        return new TaskDetailsCloudModel(response.entry);
                    }),
                    catchError(err => this.handleError(err))
            );
    }

    getUsers(): Observable<UserCloudModel[]> {
        const url = this.getUserUrl();
        const httpMethod = 'GET', pathParams = {}, queryParams = {}, bodyParam = {}, headerParams = {},
            formParams = {}, authNames = [], contentTypes = ['application/json'], accepts = ['application/json'];

        return from(this.apiService.getInstance().oauth2Auth.callCustomApi(
                    url, httpMethod, pathParams, queryParams,
                    headerParams, formParams, bodyParam, authNames,
                    contentTypes, accepts, Object, null, null)
                ).pipe(
                    map((response: UserCloudModel[]) => {
                        return response;
                    }),
                catchError(err => this.handleError(err))
            );
    }

    getUsersByRole(role: string): Observable<UserCloudModel[]> {
        const url = this.getUserByRoleUrl(role);
        const httpMethod = 'GET', pathParams = {}, queryParams = {}, bodyParam = {}, headerParams = {},
            formParams = {}, authNames = [], contentTypes = ['application/json'], accepts = ['application/json'];

        return from(this.apiService.getInstance().oauth2Auth.callCustomApi(
                    url, httpMethod, pathParams, queryParams,
                    headerParams, formParams, bodyParam, authNames,
                    contentTypes, accepts, Object, null, null)
                ).pipe(
                    map((response: UserCloudModel[]) => {
                        return response;
                    }),
                catchError(err => this.handleError(err))
            );
    }

    private buildCreateTaskUrl(appName: string): any {
        return `${this.appConfigService.get('bpmHost')}/${appName}-rb/v1/tasks`;
    }

    private getUserUrl(): any {
        return `${this.appConfigService.get('bpmHost')}/auth/admin/realms/springboot/users`;
    }

    // private exmple(): any {
    //     6f8858b8-f5c7-4782-92bd-a595c3c8c829
    //     return `${this.appConfigService.get('bpmHost')}/auth/admin/realms/springboot/users`;
    // }

    private getUserByRoleUrl(role: string): any {
        return `${this.appConfigService.get('bpmHost')}/auth/admin/realms/springboot/roles/user/users`;
    }

    private buildRequestBody(taskDetails: any) {
        return new StartTaskCloudRequestModel(taskDetails);
    }

    private handleError(error: any) {
        this.logService.error(error);
        return throwError(error || 'Server error');
    }
}
