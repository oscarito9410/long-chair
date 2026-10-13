"""Failures raised at the catalog boundary. Adapters share these types."""

from http import HTTPStatus


class PortError(Exception):
    """Base for catalog and cache failures."""

    def __init__(self, code: str, message: str) -> None:
        self.code = code
        self.message = message
        super().__init__(message)


class QlooValidationError(PortError):
    """The query would be invalid, so nothing was sent and nothing was read."""

    def __init__(self, message: str) -> None:
        super().__init__("invalid_catalog_query", message)


class QlooTransportError(PortError):
    """The live catalog did not answer. The message must not include a response body."""

    def __init__(self, message: str) -> None:
        super().__init__("catalog_unavailable", message)


class CacheMiss(PortError):
    """Replay was asked for a request that was never recorded."""

    def __init__(self, message: str) -> None:
        super().__init__("cache_miss", message)


class EnrichmentTransportError(PortError):
    """Secondary catalog transport/protocol failure, without private response details."""

    def __init__(self) -> None:
        super().__init__("enrichment_unavailable", "The enrichment source did not answer.")


class QlooProviderError(QlooTransportError):
    """Provider rejection. Diagnostic text stays internal, never in the API envelope."""

    status_code: int

    def __init__(self, provider_message: str) -> None:
        self.provider_message = provider_message
        super().__init__("The catalog could not complete the request.")


class QlooBadRequestError(QlooProviderError):
    """The provider rejected a sent query, distinct from local validation."""

    status_code = HTTPStatus.BAD_REQUEST


class QlooAuthenticationError(QlooProviderError):
    """The provider could not authenticate the key."""

    status_code = HTTPStatus.UNAUTHORIZED


class QlooAuthorizationError(QlooProviderError):
    """The provider refused access to this resource."""

    status_code = HTTPStatus.FORBIDDEN


class QlooRateLimitError(QlooProviderError):
    """The provider still limited the request after bounded retries."""

    status_code = HTTPStatus.TOO_MANY_REQUESTS
