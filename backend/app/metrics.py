from prometheus_client import CollectorRegistry, Counter

registry = CollectorRegistry()

chaos_attacks_total = Counter(
    'chaos_attacks_total', 
    'Total chaos attacks triggered', 
    ['type'],
    registry=registry,
)