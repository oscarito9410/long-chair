"""Inner layers do not import outer layers."""

import ast
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2] / "app"
FORBIDDEN = ("fastapi", "httpx", "pydantic", "app.adapters", "app.api", "app.application")


def _imports(path: Path) -> set[str]:
    tree = ast.parse(path.read_text(encoding="utf-8"))
    found: set[str] = set()
    for node in ast.walk(tree):
        if isinstance(node, ast.Import):
            found.update(alias.name for alias in node.names)
        elif isinstance(node, ast.ImportFrom) and node.module is not None:
            found.add(node.module)
    return found


def test_domain_imports_stay_inside_domain() -> None:
    for path in (ROOT / "domain").glob("*.py"):
        for name in _imports(path):
            assert not name.startswith(FORBIDDEN), f"{path.name} imports {name}"


def test_application_does_not_import_adapters_or_the_api() -> None:
    blocked = ("fastapi", "httpx", "app.adapters", "app.api")
    for path in (ROOT / "application").glob("*.py"):
        for name in _imports(path):
            assert not name.startswith(blocked), f"{path.name} imports {name}"
