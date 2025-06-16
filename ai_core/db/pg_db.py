from .db_config import get_db_session
from .db_models import LearningPlan, StudyPlanContent
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

def get_learning_plan_by_user(user_id: str):
    with get_db_session() as db:
        return db.query(LearningPlan).filter_by(user_id=user_id).order_by(LearningPlan.created_at.desc()).first()
    
    
def save_study_plan_content(plan_id: str, content_dict: dict):
    with get_db_session() as db:
        content_str = json.dumps(content_dict, sort_keys=True, ensure_ascii=False)
        content_hash = hashlib.sha256(content_str.encode('utf-8')).hexdigest()
        spc = db.query(StudyPlanContent).filter_by(study_plan_id=plan_id).first()
        if not spc:
            spc = StudyPlanContent(study_plan_id=plan_id)
        spc.content_json = content_dict
        spc.content_hash = content_hash
        db.add(spc)

def get_study_plan_content(plan_id: str):
    with get_db_session() as db:
        spc = db.query(StudyPlanContent).filter_by(study_plan_id=plan_id).first()
        if spc:
            return spc.content_json
        return None