"""Failures raised at the catalog boundary. Adapters share these types."""


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
