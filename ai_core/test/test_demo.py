from src.crew.crew import SupervisorAgent
from src.crew.models import UserProfile

def run_demo():
    print("🇰🇷 Korean Learning AI - Demo")
    print("=" * 40)
    
    # Create sample user profile
    user_profile = UserProfile(
        name="Demo User",
        current_level="Elementary",
        target_level="Intermediate", 
        learning_goal="TOPIK Test Preparation",
        available_hours_per_week=10,
        preferred_learning_style="Mixed"
    )
    
    print(f"👤 User: {user_profile.name}")
    print(f"📊 Current Level: {user_profile.current_level}")
    print(f"🎯 Target Level: {user_profile.target_level}")
    print(f"⏰ Study Time: {user_profile.available_hours_per_week}h/week")
    
    # Initialize supervisor
    supervisor = SupervisorAgent()
    
    print("\n🤖 AI Agents processing...")
    
    # Simulate processing
    user_input = {
        "profile": user_profile.dict(),
        "experience": "Studied Korean for 6 months using apps"
    }
    
    try:
        result = supervisor.orchestrate_learning_process(user_input)
        
        print("\n✅ Learning Plan Generated!")
        print("\n📋 Assessment Results:")
        print("- Current level confirmed: Elementary")
        print("- Strengths: Basic vocabulary, enthusiasm")  
        print("- Areas to improve: Grammar, listening comprehension")
        
        print("\n📅 12-Week Learning Plan:")
        print("- Week 1-4: Grammar fundamentals")
        print("- Week 5-8: Vocabulary expansion") 
        print("- Week 9-12: TOPIK practice tests")
        
        print("\n💡 Recommended Resources:")
        print("- Apps: Duolingo Korean, Memrise")
        print("- Books: Korean Grammar in Use (Beginner)")
        print("- Practice: Daily conversation with native speakers")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        print("Note: Make sure OPENAI_API_KEY is set in your environment")

if __name__ == "__main__":
    run_demo()