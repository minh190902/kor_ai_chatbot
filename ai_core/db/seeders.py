import os
import json
from .db_models import TopikQuestionType

def seed_topik_question_types(session, json_path=None):
    if not json_path:
        json_path = os.path.join(os.path.dirname(__file__), "../config/ai_topik.json")
    with open(json_path, encoding="utf-8") as f:
        config = json.load(f)
    for group in config:
        for type_name, subtypes in group.items():
            for st in subtypes:
                obj = TopikQuestionType(
                    type=type_name,
                    subtype=st["subtype"],
                    description=st.get("description", ""),
                    applicable_levels=st.get("applicable_levels", []),
                    pattern_type=st.get("pattern_type", ""),
                    format_rules=st.get("format_rules", {}),
                    is_active=True,
                )
                exists = session.query(TopikQuestionType).filter_by(
                    type=type_name, subtype=st["subtype"]
                ).first()
                if not exists:
                    session.add(obj)
    session.commit()
    print("Seeded TopikQuestionType!")