"""
护栏第1+2层参考骨架：结构校验 + 业务规则校验
这是样本，/harden 命令会照着你的项目实际情况改写。

核心思想：LLM 输出 JSON 后，不直接用，先过校验。
不合格就带着错误信息自动重试，最多 3 次。
"""

from pydantic import BaseModel, field_validator
from typing import Literal
import json


# ── 第1层：结构校验（定义期望的输出长什么样）──
class AgentOutput(BaseModel):
    """假设你的 agent 要输出一个'行动计划'"""
    action: Literal["search", "create", "update", "delete"]  # 只能是这几个值
    target: str
    confidence: float  # 置信度

    # ── 第2层：业务规则校验（内容合不合理）──
    @field_validator("confidence")
    @classmethod
    def confidence_in_range(cls, v):
        if not 0 <= v <= 1:
            raise ValueError(f"置信度必须在 0-1 之间，收到 {v}")
        return v

    @field_validator("target")
    @classmethod
    def target_not_empty(cls, v):
        if not v.strip():
            raise ValueError("target 不能为空")
        return v


def call_llm_with_validation(prompt, llm_call_fn, max_retries=3):
    """
    带校验和自动重试的 LLM 调用。
    llm_call_fn: 你实际调用 LLM 的函数，返回字符串
    """
    last_error = None
    for attempt in range(max_retries):
        # 第一次用原始 prompt，之后把错误信息加进去让 LLM 自我纠正
        current_prompt = prompt
        if last_error:
            current_prompt = (
                f"{prompt}\n\n"
                f"你上次的输出有错误：{last_error}\n"
                f"请修正后重新输出合法 JSON。"
            )

        raw = llm_call_fn(current_prompt)

        try:
            data = json.loads(raw)          # 结构校验：能不能解析成 JSON
            validated = AgentOutput(**data) # 结构+业务校验：字段和规则对不对
            return validated                # 通过，返回干净的数据
        except (json.JSONDecodeError, ValueError) as e:
            last_error = str(e)
            print(f"第 {attempt+1} 次校验失败：{last_error}，重试中…")

    # 重试用完仍失败 → 明确报错，绝不让坏数据流到下游
    raise RuntimeError(f"LLM 输出经 {max_retries} 次重试仍不合格：{last_error}")


# 用法示例：
# result = call_llm_with_validation(prompt, my_llm_function)
# 到这里 result 一定是合法的 AgentOutput，下游可以放心用
