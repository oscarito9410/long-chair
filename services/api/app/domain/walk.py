"""Walking minutes from two coordinates. This is an estimate, not a route."""

import math

EARTH_RADIUS_METERS = 6_371_000
WALK_METERS_PER_MINUTE = 80
SAMPLE_ORIGIN_LAT = 40.0
SAMPLE_ORIGIN_LON = -74.0


def walk_minutes(lat: float, lon: float, origin_lat: float, origin_lon: float) -> int:
    """Haversine distance divided by a walking pace. At least one minute."""

    start_lat = math.radians(origin_lat)
    end_lat = math.radians(lat)
    delta_lat = math.radians(lat - origin_lat)
    delta_lon = math.radians(lon - origin_lon)
    chord = (
        math.sin(delta_lat / 2) ** 2
        + math.cos(start_lat) * math.cos(end_lat) * math.sin(delta_lon / 2) ** 2
    )
    meters = 2 * EARTH_RADIUS_METERS * math.asin(math.sqrt(chord))
    return max(1, round(meters / WALK_METERS_PER_MINUTE))
