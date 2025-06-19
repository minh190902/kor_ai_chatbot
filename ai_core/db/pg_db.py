from .db_config import get_db_session
from .db_models import LearningPlan, VocabExpansion
import xmltodict
import hashlib
import json

def create_learning_plan(user_id: str):
    with get_db_session() as db:
        plan = LearningPlan(user_id=user_id)
        db.add(plan)
        db.flush()
        return str(plan.plan_id)

def update_learning_plan(plan_id: str, learning_plan: str, status: str = "done"):
    try:
        doc = xmltodict.parse(learning_plan)
        study_plan = doc.get("study_plan", {})
        title = study_plan.get("title", "")
        overview = study_plan.get("overview", "")
    except Exception:
        title = ""
        overview = ""
    print(f"Updating learning plan {plan_id} with status {status}, title: {title}, overview: {overview}")
    with get_db_session() as db:
        plan = db.query(LearningPlan).filter_by(plan_id=plan_id).first()
        if plan:
            plan.learning_plan = learning_plan
            plan.status = status
            plan.title = title
            plan.overview = overview
            db.add(plan)

def create_vocab_expansion(user_id: str, user_word: str):
    """
    Create a new vocabulary expansion entry in the database.
    """
    with get_db_session() as db:
        vocab_expansion = VocabExpansion(
            user_id=user_id,
            user_word=user_word,
            xml_response=""
        )
        db.add(vocab_expansion)
        db.flush()
        return vocab_expansion.vocab_id
     
def update_vocab_expansion(vocab_id: int, xml_response: str, status: str = "done"):
    """
    Update the XML response for a vocabulary expansion entry.
    """
    with get_db_session() as db:
        vocab_expansion = db.query(VocabExpansion).filter_by(vocab_id=vocab_id).first()
        if vocab_expansion:
            vocab_expansion.xml_response = xml_response
            db.add(vocab_expansion)
            db.flush()
            return True
        return False