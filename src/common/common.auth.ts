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

  isAdminOrUserself(payload: any = null, requestId: string) {
    if (payload) {
      // admin or user `my information`
      if (payload.is_admin || (!payload.is_admin && requestId === payload.id)) {
        return true;
      }
    }
    return false;
  }
}
