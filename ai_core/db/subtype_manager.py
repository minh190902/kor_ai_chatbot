from .db_models import TopikQuestionType
from sqlalchemy.orm import Session

class SubtypeManagerDB:
    """Quản lý subtype lấy từ DB thay vì file JSON"""

    def __init__(self, db_session: Session):
        self.db = db_session

    def get_subtypes_for_type(self, type_name: str, level: str = None):
        query = self.db.query(TopikQuestionType).filter(TopikQuestionType.type == type_name, TopikQuestionType.is_active == True)
        if level:
            # Lọc applicable_levels chứa level
            query = query.filter(TopikQuestionType.applicable_levels.contains([level]))
        return query.all()

    def get_subtype_detail(self, type_name: str, subtype: str):
        return (
            self.db.query(TopikQuestionType)
            .filter(
                TopikQuestionType.type == type_name,
                TopikQuestionType.subtype == subtype,
                TopikQuestionType.is_active == True
            )
            .first()
        )

    def select_random_subtype(self, type_name: str, level: str):
        from random import choice
        subtypes = self.get_subtypes_for_type(type_name, level)
        return choice(subtypes) if subtypes else None

    def generate_subtype_context(self, subtype_obj: TopikQuestionType) -> str:
        """Sinh prompt context từ object DB"""
        if not subtype_obj:
            return ""
        pattern_type = subtype_obj.pattern_type or ""
        format_rules = subtype_obj.format_rules or {}
        description = subtype_obj.description or ""
        context = f"""
# SUBTYPE-SPECIFIC REQUIREMENTS:
Subtype: {subtype_obj.subtype}
Description: {description}
Pattern Type: {pattern_type}

## Format Rules:
- PASSAGE: {format_rules.get('passage', 'Must be appropriate for subtype')}
- QUESTION: {format_rules.get('question', 'Must match subtype requirements')}
- CHOICES: {format_rules.get('choices', 'Must provide appropriate options')}
- NOTES: {format_rules.get('notes', 'Any additional notes for subtype')}

ENSURE PERFECT CONSISTENCY: All components (passage, question, choices, explanation) must be perfectly aligned with these subtype requirements.
"""
        return context.strip()
