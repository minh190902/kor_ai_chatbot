import gradio as gr
import uuid
from typing import List, Tuple, Dict, Any
from models.kor_learning import KorLearningModels
from crew.crew import KoreanAILearningPath
from crew.models import UserProfile
from config.settings import settings
import json

class KoreanChatbotUI:
    """Gradio interface for Korean learning chatbot"""

    def __init__(self):
        self.user_sessions = {}  # Store multiple user sessions
        self.crew = KoreanAILearningPath()

    def initialize_agent(self, user_id: str, session_id: str, level: str) -> KorLearningModels:
        """Initialize or get existing agent for user and session"""
        session_key = f"{user_id}_{session_id}_{level}"
        if session_key not in self.user_sessions:
            self.user_sessions[session_key] = KorLearningModels(user_id, session_id, level)
        return self.user_sessions[session_key]

    def chat_with_bot(
        self,
        message: str,
        history: List[List[str]],
        user_id: str,
        session_id: str,
        level: str,
        # progress_display: str
    ) -> Tuple[str, List[List[str]], str]:
        """Handle chat interaction"""
        if not message.strip():
            return "", history

        agent = self.initialize_agent(user_id, session_id, level)
        result = agent.chat(message)

        if result["success"]:
            response = result["response"]
            # progress_info = result.get("progress", {})
            # progress_display = self._format_progress_display(progress_info)
        else:
            response = result["response"]

        history.append([message, response])
        return "", history

    def _format_progress_display(self, progress: Dict[str, Any]) -> str:
        if not progress:
            return "📊 **학습 진도 (Learning Progress)**\n\n진도 정보를 불러오는 중..."
        display = "📊 **학습 진도 (Learning Progress)**\n\n"
        display += f"**총 대화 수:** {progress.get('total_conversations', 0)}\n"
        display += f"**오늘 학습 시간:** {progress.get('today_study_time', 0)}분\n"
        display += f"**현재 레벨:** {progress.get('current_level', 'beginner')}\n\n"
        tool_usage = progress.get('tool_usage', {})
        if tool_usage:
            display += "**도구 사용 현황:**\n"
            for tool, count in tool_usage.items():
                display += f"• {tool}: {count}회\n"
        achievements = progress.get('recent_achievements', [])
        if achievements:
            display += "\n**최근 성취:**\n"
            for achievement in achievements[-3:]:
                display += f"🏆 {achievement}\n"
        return display

    def clear_chat(self, user_id: str, session_id: str, level: str) -> Tuple[List, str]:
        """Clear chat history"""
        agent = self.initialize_agent(user_id, session_id, level)
        agent.reset_conversation()
        return []

    def _format_detailed_stats(self, stats: Dict[str, Any]) -> str:
        if not stats:
            return "통계 정보를 불러올 수 없습니다."
        display = "📈 **상세 학습 통계 (Detailed Learning Stats)**\n\n"
        display += f"**전체 진도:**\n"
        display += f"• 총 학습 일수: {stats.get('total_study_days', 0)}일\n"
        display += f"• 총 대화 수: {stats.get('total_conversations', 0)}회\n"
        display += f"• 총 학습 시간: {stats.get('total_study_time', 0)}분\n\n"
        skills = stats.get('skill_progress', {})
        if skills:
            display += "**기능별 진도:**\n"
            for skill, progress in skills.items():
                display += f"• {skill}: {progress}%\n"
        weekly = stats.get('weekly_progress', [])
        if weekly:
            display += "\n**주간 학습 현황:**\n"
            for day_data in weekly[-7:]:
                date = day_data.get('date', 'Unknown')
                conversations = day_data.get('conversations', 0)
                display += f"• {date}: {conversations}회 대화\n"
        return display
    
    def assess_and_plan(self, name, current_level, target_level, learning_goal, 
                       hours_per_week, preferred_style, experience):
        """Main function to assess user and create learning plan"""
        
        user_input = UserProfile(
            name=name,
            current_level=current_level,
            target_level=target_level,
            learning_goal=learning_goal,
            available_hours_per_week=hours_per_week,
            preferred_learning_style=preferred_style,
            experience=experience
        )
        
        # Get results from supervisor agent
        result = self.crew.run(user_input.model_dump())
        
        # Format output for display
        assessment_text = self._format_assessment(result["assessment"])
        plan_text = self._format_learning_plan(result["learning_plan"])
        recommendations_text = self._format_recommendations(result["recommendations"])
        
        return assessment_text, plan_text, recommendations_text
    
    def _format_assessment(self, assessment):
        return f"""
        ## 📊 Korean Level Assessment
        
        **Overall Level:** {assessment.get('overall_level', 'To be determined')}
        
        **Strengths:**
        {chr(10).join([f"• {strength}" for strength in assessment.get('strengths', [])])}
        
        **Areas for Improvement:**
        {chr(10).join([f"• {weakness}" for weakness in assessment.get('weaknesses', [])])}
        
        **Recommendations:**
        {assessment.get('recommendations', 'Detailed assessment pending...')}
        """
    
    def _format_learning_plan(self, plan):
        return f"""
        ## 📅 Personalized Learning Plan
        
        **Duration:** {plan.get('duration_weeks', 12)} weeks
        
        **Weekly Schedule:**
        {self._format_weekly_schedule(plan.get('weekly_goals', {}))}
        
        **Key Milestones:**
        {chr(10).join([f"Week {i*4}: {milestone}" for i, milestone in enumerate(plan.get('milestones', []), 1)])}
        
        **Daily Study Structure:**
        {plan.get('daily_schedule', 'Customized schedule will be generated...')}
        """
    
    def _format_recommendations(self, recommendations):
        return f"""
        ## 💡 Recommended Resources
        
        **Recommended Apps:**
        {chr(10).join([f"• {app}" for app in recommendations.get('apps', ['Duolingo Korean', 'Memrise Korean', 'HelloTalk'])])}
        
        **Study Materials:**
        {chr(10).join([f"• {book}" for book in recommendations.get('books', ['Korean Grammar in Use', 'Integrated Korean Textbook'])])}
        
        **Practice Activities:**
        {chr(10).join([f"• {activity}" for activity in recommendations.get('practice_activities', ['Daily conversation practice', 'TOPIK mock tests'])])}
        """
    
    def _format_weekly_schedule(self, weekly_goals):
        if not weekly_goals:
            return "• Week 1-4: Foundation building\n• Week 5-8: Skill development\n• Week 9-12: Advanced practice"
        return chr(10).join([f"• Week {week}: {goal}" for week, goal in weekly_goals.items()])
    
    def create_interface(self) -> gr.Blocks:
        """Create Gradio interface with two tabs: Learning Plan & Chatbot"""

        with gr.Blocks(
            theme=gr.themes.Soft(),
            title="Korean Learning AI Assistant",
            css="""
            .main-container { max-width: 1200px; margin: 0 auto; }
            .chat-container { height: 600px; }
            .progress-container { height: 400px; overflow-y: auto; }
            .stats-container { height: 300px; overflow-y: auto; }
            """
        ) as interface:
            with gr.Tabs():
                # Tab 1: Learning Plan
                with gr.TabItem("📅 Learning Plan Generator"):
                    gr.Markdown("# 🇰🇷 AI Korean Learning Path Generator")
                    gr.Markdown("Get your personalized Korean learning plan powered by AI!")

                    with gr.Row():
                        with gr.Column():
                            gr.Markdown("## 📝 Tell us about yourself")
                            name = gr.Textbox(label="Name", placeholder="Enter your name")
                            current_level = gr.Dropdown(
                                choices=list(settings.TOPIK_LEVELS.keys()),
                                label="Current Korean Level",
                                value="Beginner"
                            )
                            target_level = gr.Dropdown(
                                choices=list(settings.TOPIK_LEVELS.keys()),
                                label="Target Korean Level",
                                value="Intermediate"
                            )
                            learning_goal = gr.Dropdown(
                                choices=settings.LEARNING_GOALS,
                                label="Primary Learning Goal",
                                value="Conversational Korean"
                            )
                            hours_per_week = gr.Slider(
                                minimum=1, maximum=30, value=5,
                                label="Available Study Hours per Week"
                            )
                            preferred_style = gr.Radio(
                                choices=["Visual", "Auditory", "Kinesthetic", "Mixed"],
                                label="Preferred Learning Style",
                                value="Mixed"
                            )
                            experience = gr.Textbox(
                                label="Previous Korean Learning Experience (Optional)",
                                placeholder="Describe any previous study, time in Korea, etc.",
                                lines=3
                            )
                            generate_btn = gr.Button("🚀 Generate My Learning Plan", variant="primary")

                    with gr.Row():
                        with gr.Column():
                            assessment_output = gr.Markdown(label="Assessment Results")
                        with gr.Column():
                            plan_output = gr.Markdown(label="Learning Plan")
                        with gr.Column():
                            recommendations_output = gr.Markdown(label="Recommendations")

                    generate_btn.click(
                        self.assess_and_plan,
                        inputs=[name, current_level, target_level, learning_goal,
                                hours_per_week, preferred_style, experience],
                        outputs=[assessment_output, plan_output, recommendations_output]
                    )

                    gr.Markdown("""
                    ## 📚 How it works:
                    1. **Assessment**: AI analyzes your current level and goals
                    2. **Planning**: Creates a personalized week-by-week study plan
                    3. **Recommendations**: Suggests the best resources for your needs
                    4. **Tracking**: (Coming soon) Monitor progress and adjust plan
                    """)

                # Tab 2: Chatbot
                with gr.TabItem("💬 Korean Learning Chatbot"):
                    # Tạo user_id và session_id ngẫu nhiên cho mỗi session
                    user_id_state = gr.State(str(uuid.uuid4()))
                    session_id_state = gr.State(str(uuid.uuid4()))

                    gr.Markdown(
                        """
                        # 🇰🇷 한국어 학습 챗봇 (Korean Learning Chatbot)
                        안녕하세요! 한국어 학습을 도와드리는 AI 챗봇입니다.
                        Hello! I'm an AI chatbot here to help you learn Korean.
                        """
                    )

                    with gr.Row():
                        with gr.Column(scale=2):
                            with gr.Group():
                                gr.Markdown("### 👤 사용자 설정 (User Settings)")
                                level = gr.Dropdown(
                                    choices=settings.SUPPORTED_LEVELS,
                                    label="학습 레벨 (Learning Level)",
                                    value="beginner"
                                )
                            with gr.Group():
                                gr.Markdown("### 💬 대화 (Chat)")
                                chatbot = gr.Chatbot(
                                    label="한국어 학습 대화",
                                    height=500,
                                    elem_classes=["chat-container"],
                                )
                                with gr.Row():
                                    message_input = gr.Textbox(
                                        label="메시지 입력 (Enter your message)",
                                        placeholder="한국어로 질문하거나 문장을 입력하세요... (Ask in Korean or enter a sentence...)",
                                        scale=4
                                    )
                                    send_btn = gr.Button("전송 (Send)", scale=1, variant="primary")
                                with gr.Row():
                                    clear_btn = gr.Button("대화 초기화 (Clear Chat)")
                                    level_change_btn = gr.Button("레벨 변경 적용 (Apply Level Change)")

                        with gr.Column(scale=1):
                            with gr.Group():
                                gr.Markdown("### 📊 학습 진도 (Progress)")
                                progress_display = gr.Markdown(
                                    "진도 정보를 불러오는 중...",
                                    elem_classes=["progress-container"]
                                )
                                refresh_progress_btn = gr.Button("진도 새로고침 (Refresh Progress)")
                            with gr.Group():
                                gr.Markdown("### 📈 상세 통계 (Detailed Stats)")
                                stats_display = gr.Markdown(
                                    "통계를 보려면 버튼을 클릭하세요.",
                                    elem_classes=["stats-container"]
                                )
                                show_stats_btn = gr.Button("통계 보기 (Show Stats)")

                    with gr.Accordion("💡 사용 팁 (Usage Tips)", open=False):
                        gr.Markdown(
                            """
                            **문법 검사:** "이 문장이 맞나요?" + 한국어 문장  
                            **어휘 학습:** "~의 뜻이 뭐예요?" 또는 "vocabulary practice"  
                            **발음 도움:** "~은/는 어떻게 발음해요?"  
                            **문화 설명:** "한국 문화에서 ~은/는 어떤 의미예요?"  
                            """
                        )

                    # Event handlers
                    def handle_send(message, history, user_id, session_id, level):
                        return self.chat_with_bot(message, history, user_id, session_id, level)

                    def handle_clear(user_id, session_id, level):
                        return self.clear_chat(user_id, session_id, level)

                    send_btn.click(
                        fn=handle_send,
                        inputs=[message_input, chatbot, user_id_state, session_id_state, level],
                        outputs=[message_input, chatbot]
                    )

                    message_input.submit(
                        fn=handle_send,
                        inputs=[message_input, chatbot, user_id_state, session_id_state, level],
                        outputs=[message_input, chatbot]
                    )

                    clear_btn.click(
                        fn=handle_clear,
                        inputs=[user_id_state, session_id_state, level],
                        outputs=[chatbot]
                    )

        return interface

    def launch(self, share: bool = False, debug: bool = False):
        """Launch the Gradio interface"""
        interface = self.create_interface()
        interface.launch(
            server_name=settings.GRADIO_HOST,
            server_port=settings.GRADIO_PORT,
            share=share,
            debug=debug,
            show_error=True,
            quiet=False
        )