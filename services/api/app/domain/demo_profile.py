"""The mixed sample the prototype already fills. Keep it aligned with src/data/demo-profile.ts."""

from app.domain.entities import AvoidTheme, SessionDraft, TasteSeed
from app.domain.kinds import Weekday
from app.domain.limits import DEMO_COMPANION_ID, DEMO_LOCALITY, LONG_CHAIR_MINUTES

HELD_ASIDE_SEED_ID = "sunday-engines"
AVAILABLE_THEME_IDS = frozenset({"grief", "parent-death"})

TASTES: tuple[TasteSeed, ...] = (
    TasteSeed("mira-solano", "artist", "Mira Solano", "Warm vocal jazz in small rooms"),
    TasteSeed("harbor-lights", "tv_show", "Harbor Lights", "A coastal mystery, told quietly"),
    TasteSeed("paper-kite", "movie", "The Paper Kite", "A slow road film about a repair"),
    TasteSeed("salt-windowlight", "book", "Salt and Windowlight", "Essays on kitchens and weather"),
    TasteSeed("slow-kitchen", "podcast", "Slow Kitchen Radio", "One recipe, and no rush"),
    TasteSeed("sunday-engines", "movie", "Sunday Engines", "A gentle film about small trains"),
)

THEMES: tuple[AvoidTheme, ...] = (
    AvoidTheme("illness", "Illness", "Stories built around being sick"),
    AvoidTheme("hospitals", "Hospitals", "Wards, clinics, and waiting rooms"),
    AvoidTheme("cancer", "Cancer", "Diagnosis and treatment as the plot"),
    AvoidTheme("parent-death", "Death of a parent", "Losing a mother or a father"),
    AvoidTheme("grief", "Grief", "Mourning as the main thread"),
)

DEMO_DRAFT = SessionDraft(
    seed_ids=tuple(taste.id for taste in TASTES if taste.id != HELD_ASIDE_SEED_ID),
    avoid_ids=tuple(theme.id for theme in THEMES if theme.id not in AVAILABLE_THEME_IDS),
    duration_minutes=LONG_CHAIR_MINUTES,
    companion_id=DEMO_COMPANION_ID,
)


def demo_locality() -> str:
    """Neighborhood string sent as a place filter. Not a hospital name."""

    return DEMO_LOCALITY


def demo_weekday() -> Weekday:
    """Fixed weekday so the demo plan does not depend on the server clock."""

    return "sunday"
