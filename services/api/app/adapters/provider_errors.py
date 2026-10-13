"""Decode diagnostic messages without leaking provider bodies through public errors."""

import json

import httpx

from app.ports.errors import (
    QlooAuthenticationError,
    QlooAuthorizationError,
    QlooBadRequestError,
    QlooProviderError,
    QlooRateLimitError,
    QlooTransportError,
)

ERROR_TYPES: dict[int, type[QlooProviderError]] = {
    QlooBadRequestError.status_code: QlooBadRequestError,
    QlooAuthenticationError.status_code: QlooAuthenticationError,
    QlooAuthorizationError.status_code: QlooAuthorizationError,
    QlooRateLimitError.status_code: QlooRateLimitError,
}


def response_error(response: httpx.Response, api_key: str) -> QlooTransportError:
    """Extract only message/reason, retaining a safe public port message."""
    error_type = ERROR_TYPES.get(response.status_code)
    if error_type is None:
        return QlooTransportError("The catalog did not answer.")
    try:
        payload = response.json()
    except (json.JSONDecodeError, UnicodeDecodeError):
        payload = None
    message = _message(payload) or "The catalog did not provide a diagnostic message."
    if api_key:
        message = message.replace(api_key, "[redacted]")
    return error_type(message)


def _message(payload: object) -> str | None:
    if not isinstance(payload, dict):
        return None
    error = payload.get("error")
    errors = payload.get("errors")
    rows = [error] if isinstance(error, dict) else errors if isinstance(errors, list) else []
    messages: list[str] = []
    for row in rows:
        if not isinstance(row, dict):
            continue
        message = row.get("message") or row.get("reason")
        if isinstance(message, str) and message.strip():
            messages.append(message.strip())
    return "; ".join(messages) if messages else None
