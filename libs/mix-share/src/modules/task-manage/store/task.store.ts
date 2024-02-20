import { Injectable, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  MixFilter,
  MixTaskNew,
  PaginationRequestModel,
  TaskStatistic,
  TaskStatus,
} from '@mixcore/lib/model';
import { BaseCRUDStore } from '@mixcore/share/base';
import { ObjectUtil } from '@mixcore/share/form';
import * as R from 'remeda';
import { combineLatest, map, switchMap, tap } from 'rxjs';
import { DatabaseName } from '../const/database-name';
import { TaskManageStore } from './task-ui.store';

@Injectable({ providedIn: 'root' })
export class TaskStore extends BaseCRUDStore<MixTaskNew> {
  public taskUiStore = inject(TaskManageStore);
  public status$$ = toSignal(this.select((s) => s.status));

  public state$$ = toSignal(
    combineLatest([this.request$$, this.taskUiStore.selectedProjectId$]).pipe(
      tap(([request, projectId]) => {
        request['compareType'] = 'or';
        request['filterType'] = 'contain';
        request.orderBy = 'CreatedDateTime';
        request.searchMethod = 'Like';
        request.status = 'Published';
        request.direction = 'Desc';
        request.mixDatabaseName = DatabaseName.mixProject;
        request['isGroup'] = false;
        request.queries = <MixFilter[]>[
          {
            value: projectId,
            fieldName: 'mixProjectId',
            compareOperator: 'Equal',
          },
        ];

        this.loadData(request);
      }),
      switchMap(() => this.select((s) => s))
    )
  );

  public getTaskByStatus = (status: TaskStatus, parentTaskId: number) => {
    return this.select((s) => s).pipe(
      map((s) => {
        return s.data
          .filter(
            (x) => x.taskStatus === status && x.parentTaskId === parentTaskId
          )
          .sort((a, b) => a.priority - b.priority);
      })
    );
  };

  public getTaskById = (id: number) => {
    return this.select((s) => s).pipe(
      map((x) => x.data.find((t) => t.id === id))
    );
  };

  public getParentTasks = () => {
    return this.select((s) => s).pipe(
      map((s) => {
        return s.data
          .filter((x) => !x.parentTaskId)
          .sort((a, b) => a.priority - b.priority);
      })
    );
  };

  public getTaskByParentTaskId = (id: number) => {
    return this.select((s) => s).pipe(
      map((x) => x.data.filter((t) => t.parentTaskId === id))
    );
  };

  public calculateTaskInfo = (id: number) => {
    return this.select((s) => s).pipe(
      map((x) => x.data.filter((t) => t.parentTaskId === id)),
      map((childTask) => {
        return <TaskStatistic>{
          done: childTask.filter((x) => x.taskStatus === TaskStatus.DONE)
            .length,
          total: childTask.length,
        };
      })
    );
  };

  public addTask = (task: MixTaskNew, mode: 'Update' | 'Create' = 'Create') => {
    const currentData = this.get().data;
    if (mode === 'Create') {
      currentData.unshift(task);
    } else {
      const taskIndex = currentData.findIndex((x) => x.id === task.id);
      if (taskIndex >= 0) currentData[taskIndex] = task;
    }

    this.patchState({ data: R.clone(currentData) });
    this.reUpdateCache();
  };

  public deleteTask = (task: MixTaskNew) => {
    let currentData = this.get().data;
    currentData = currentData.filter((x) => x.id !== task.id);

    this.patchState({ data: R.clone(currentData) });
    this.reUpdateCache();
  };

  public override requestFn = (request: PaginationRequestModel) =>
    this.mixApi.databaseApi
      .getDataByName<MixTaskNew>(DatabaseName.mixTask, request)
      .pipe(
        map((result) => {
          result.items = result.items.map((i) => new MixTaskNew(i));

          return result;
        })
      );

  public override requestName = DatabaseName.mixTask;
  public override searchColumns = ['Title', 'Description'];
  public override searchColumnsDict: { [key: string]: string } = {
    Title: 'title',
    Description: 'description',
  };
  public override buildCacheKey(request: PaginationRequestModel): string {
    return `${this.requestName}-${ObjectUtil.objectToQueryString(request)}`;
  }
}
