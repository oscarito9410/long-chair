"""Draft failures a screen can show. Codes are stable. Messages are English."""


class DraftError(Exception):
    """The draft cannot be planned. `code` is a short token. `message` is safe to show."""

    def __init__(self, code: str, message: str) -> None:
        self.code = code
        self.message = message
        super().__init__(message)
