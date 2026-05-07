import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { chuanHoaVaiTroNoiBo } from '../vai-tro';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user) {
        return false;
    }
    
    const vaiTro = chuanHoaVaiTroNoiBo(String(user.vaiTro || ''));

    if (requiredRoles.some((role) => role === vaiTro)) {
        return true;
    }
    
    throw new ForbiddenException('Bạn không có quyền thực hiện thao tác này.');
  }
}
