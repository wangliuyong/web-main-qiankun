import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ensureAdminSuperRole, syncRbacModules } from './rbac-sync';

/**
 * 应用启动时增量同步 RBAC 菜单与权限点。
 * 解决代码新增菜单后，已有数据库未执行 seed 导致侧栏不显示的问题。
 */
@Injectable()
export class RbacSyncService implements OnModuleInit {
  private readonly logger = new Logger(RbacSyncService.name);

  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    try {
      await syncRbacModules(this.prisma);

      // 自愈：确保默认 admin 账号始终绑定超管（避免生产库角色被误删导致 403）
      const adminUser = await this.prisma.adminUser.findUnique({
        where: { username: 'admin' },
        select: { id: true },
      });
      if (adminUser) {
        await ensureAdminSuperRole(this.prisma, adminUser.id);
      }

      this.logger.log('RBAC 菜单与权限点已同步');
    } catch (err) {
      this.logger.error('RBAC 同步失败', err instanceof Error ? err.stack : err);
    }
  }
}
