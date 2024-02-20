import { Injectable, inject } from '@angular/core';
import { MixDynamicData, MixTaskNew } from '@mixcore/lib/model';
import { MixApiFacadeService } from '@mixcore/share/api';
import { ObjectUtil } from '@mixcore/share/form';
import { DatabaseName } from '../const/database-name';

@Injectable({ providedIn: 'root' })
export class TaskService {
  public mixApi = inject(MixApiFacadeService);

  public saveTask(task: MixTaskNew) {
    return this.mixApi.databaseApi.saveData(
      DatabaseName.mixTask,
      task.id ?? -1,
      ObjectUtil.clean(task) as unknown as MixDynamicData
    );
  }

  public deleteTask(task: MixTaskNew) {
    return this.mixApi.databaseApi.deleteData(DatabaseName.mixTask, task.id);
  }
}
