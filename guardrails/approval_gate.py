"""
护栏第3层参考骨架：用户确认门
这是样本，/harden 命令会照着你的项目实际情况改写。

核心思想：把操作分级。危险操作（删除/付款/改权限）
绝不自动执行，必须返回"待确认"，等人明确批准。
"""

from enum import Enum
from dataclasses import dataclass


class RiskLevel(Enum):
    SAFE = "safe"       # 🟢 读数据、查询 → 直接执行
    WRITE = "write"     # 🟡 改数据、发消息 → 可配置是否确认
    DANGER = "danger"   # 🔴 删除、付款、改权限 → 必须人确认


# 操作风险分级表（按你的业务定义）
OPERATION_RISK = {
    "search": RiskLevel.SAFE,
    "read": RiskLevel.SAFE,
    "create": RiskLevel.WRITE,
    "update": RiskLevel.WRITE,
    "delete": RiskLevel.DANGER,
    "payment": RiskLevel.DANGER,
    "change_permission": RiskLevel.DANGER,
    "send_email": RiskLevel.DANGER,
}


@dataclass
class PendingAction:
    """一个等待确认的操作"""
    operation: str
    params: dict
    risk: RiskLevel


def execute_with_gate(operation, params, executor_fn, require_confirm_write=False):
    """
    带确认门的操作执行。
    返回：要么执行结果，要么一个 PendingAction（表示需要人确认）
    """
    risk = OPERATION_RISK.get(operation, RiskLevel.DANGER)  # 未知操作默认当危险

    # 🔴 危险操作：永远不自动执行，返回待确认
    if risk == RiskLevel.DANGER:
        return PendingAction(operation, params, risk)

    # 🟡 写操作：按配置决定
    if risk == RiskLevel.WRITE and require_confirm_write:
        return PendingAction(operation, params, risk)

    # 🟢 安全操作（或配置为不需确认的写操作）：直接执行
    return executor_fn(operation, params)


def confirm_and_execute(pending: PendingAction, executor_fn, user_approved: bool):
    """人看过 PendingAction 后调这个。user_approved 是人的决定。"""
    if not user_approved:
        return {"status": "rejected", "operation": pending.operation}
    return executor_fn(pending.operation, pending.params)


# 用法示例：
# result = execute_with_gate("delete", {"id": 123}, my_executor)
# if isinstance(result, PendingAction):
#     # 把 result 展示给用户：你确认要删除 id=123 吗？
#     # 拿到用户决定后：
#     final = confirm_and_execute(result, my_executor, user_approved=True)
#
# 关键：删除操作永远走"先返回待确认"这条路，
# 代码层面保证 AI 不可能自动删东西。
