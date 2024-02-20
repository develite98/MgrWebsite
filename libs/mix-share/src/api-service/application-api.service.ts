import { MixSwagger } from '@mixcore/lib/swagger';
import { BaseApiService } from '../bases/base-api.service';

export class MixApplicationApi extends BaseApiService {
  public restartApplication() {
    return this.get(MixSwagger.global.restartApp);
  }
}
