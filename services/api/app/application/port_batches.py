"""Concurrent port work stays owned until every operation has finished or been cancelled."""

import asyncio
from collections.abc import Awaitable, Iterable


async def collect_port_batch[Result](operations: Iterable[Awaitable[Result]]) -> list[Result]:
    """Preserve result order; drain siblings before propagating failure or cancellation.

    Cleanup remains in the caller's deadline scope. A deadline that interrupts
    cleanup cancels the draining gather too, which waits for its children to finish.
    """

    tasks: list[asyncio.Future[Result]] = []
    try:
        for operation in operations:
            tasks.append(asyncio.ensure_future(operation))
        return await asyncio.gather(*tasks)
    finally:
        for task in tasks:
            if not task.done():
                task.cancel()
        await asyncio.gather(*tasks, return_exceptions=True)
