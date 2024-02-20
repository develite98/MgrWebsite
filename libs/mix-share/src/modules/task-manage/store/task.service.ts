import { Injectable, inject } from '@angular/core';
import { MixDynamicData, MixTaskNew } from '@mixcore/lib/model';
import { MixApiFacadeService } from '@mixcore/share/api';
import { DatabaseName } from '../const/database-name';

@Injectable({ providedIn: 'root' })
export class TaskService {
  public mixApi = inject(MixApiFacadeService);

  public saveTask(task: MixTaskNew) {
    return this.mixApi.databaseApi.saveData(
      DatabaseName.mixTask,
      task.id ?? -1,
      task as unknown as MixDynamicData
    );
  }

  public deleteTask(task: MixTaskNew) {
    return this.mixApi.databaseApi.deleteData(DatabaseName.mixTask, task.id);
  }
}
