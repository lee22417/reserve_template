import { Injectable } from '@nestjs/common';

@Injectable()
export class CommonAuth {
  isAdmin(payload: any = null) {
    if (payload && payload.is_admin) {
      return true;
    } else {
      return false;
    }
  }

  isAdminOrUserself(payload: any = null, requestNo: number) {
    if (payload) {
      // admin or user `my information`
      if (payload.is_admin || (!payload.is_admin && requestNo === payload.no)) {
        return true;
      }
    }
    return false;
  }
}
