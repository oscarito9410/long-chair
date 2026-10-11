"""ASGI entrypoint. `uvicorn app.api.main:app`."""

import os

from fastapi import FastAPI

from app.api.composition import DEFAULT_MODE, build_qloo
from app.api.routes import install_error_handlers, register_routes
from app.ports.qloo import QlooPort


def create_app(qloo: QlooPort | None = None, mode: str | None = None) -> FastAPI:
    """Build the app. Tests pass a fake port. The process default reads QLOO_MODE."""

    resolved = mode if mode is not None else os.environ.get("QLOO_MODE", DEFAULT_MODE)
    catalog = qloo if qloo is not None else build_qloo(resolved)
    app = FastAPI(title="Long Chair API")
    app.state.qloo_mode = resolved
    install_error_handlers(app)
    register_routes(app, catalog)
    return app


app = create_app()
