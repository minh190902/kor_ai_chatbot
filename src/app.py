"""
Gradio UI Interface for Korean Learning Chatbot
"""
import gradio as gr
import json
from typing import List, Tuple, Dict, Any
from datetime import datetime

from models.kor_learning import KorLearningModels
from config.settings import settings


class KoreanChatbotUI:
    """Gradio interface for Korean learning chatbot"""
    
    def __init__(self):
        self.current_agent = None
        self.user_sessions = {}  # Store multiple user sessions
        
    def initialize_agent(self, user_id: str, level: str) -> KorLearningModels:
        """Initialize or get existing agent for user"""
        session_key = f"{user_id}_{level}"
        
        if session_key not in self.user_sessions:
            self.user_sessions[session_key] = KorLearningModels(user_id, level)
        
        return self.user_sessions[session_key]
    
    def chat_with_bot(
        self, 
        message: str, 
        history: List[List[str]], 
        user_id: str, 
        level: str,
        progress_display: str
    ) -> Tuple[str, List[List[str]], str]:
        """Handle chat interaction"""
        
        if not message.strip():
            return "", history, progress_display
        
        # Initialize agent
        agent = self.initialize_agent(user_id, level)
        
        # Get response from agent
        result = agent.chat(message)
        
        if result["success"]:
            response = result["response"]
            
            # Update progress display
            progress_info = result.get("progress", {})
            progress_display = self._format_progress_display(progress_info)
            
        else:
            response = result["response"]
        
        # Update chat history
        history.append([message, response])
        
        return "", history, progress_display
    
    def _format_progress_display(self, progress: Dict[str, Any]) -> str:
        """Format progress information for display"""
        if not progress:
            return "📊 **학습 진도 (Learning Progress)**\n\n진도 정보를 불러오는 중..."
        
        display = "📊 **학습 진도 (Learning Progress)**\n\n"
        
        # Basic stats
        display += f"**총 대화 수:** {progress.get('total_conversations', 0)}\n"
        display += f"**오늘 학습 시간:** {progress.get('today_study_time', 0)}분\n"
        display += f"**현재 레벨:** {progress.get('current_level', 'beginner')}\n\n"
        
        # Tool usage
        tool_usage = progress.get('tool_usage', {})
        if tool_usage:
            display += "**도구 사용 현황:**\n"
            for tool, count in tool_usage.items():
                display += f"• {tool}: {count}회\n"
        
        # Recent achievements
        achievements = progress.get('recent_achievements', [])
        if achievements:
            display += "\n**최근 성취:**\n"
            for achievement in achievements[-3:]:  # Show last 3
                display += f"🏆 {achievement}\n"
        
        return display
    
    def change_level(self, user_id: str, new_level: str) -> str:
        """Handle level change"""
        session_key = f"{user_id}_{new_level}"
        
        # Initialize new agent with new level
        self.user_sessions[session_key] = KorLearningModels(user_id, new_level)
        
        return f"레벨이 {new_level}로 변경되었습니다! Level changed to {new_level}!"
    
    def clear_chat(self, user_id: str, level: str) -> Tuple[List, str]:
        """Clear chat history"""
        agent = self.initialize_agent(user_id, level)
        agent.reset_conversation()
        
        return [], "대화가 초기화되었습니다. Chat has been cleared!"
    
    def get_learning_stats(self, user_id: str, level: str) -> str:
        """Get detailed learning statistics"""
        agent = self.initialize_agent(user_id, level)
        stats = agent.get_learning_stats()
        
        return self._format_detailed_stats(stats)
    
    def _format_detailed_stats(self, stats: Dict[str, Any]) -> str:
        """Format detailed learning statistics"""
        if not stats:
            return "통계 정보를 불러올 수 없습니다."
        
        display = "📈 **상세 학습 통계 (Detailed Learning Stats)**\n\n"
        
        # Overall progress
        display += f"**전체 진도:**\n"
        display += f"• 총 학습 일수: {stats.get('total_study_days', 0)}일\n"
        display += f"• 총 대화 수: {stats.get('total_conversations', 0)}회\n"
        display += f"• 총 학습 시간: {stats.get('total_study_time', 0)}분\n\n"
        
        # Skill breakdown
        skills = stats.get('skill_progress', {})
        if skills:
            display += "**기능별 진도:**\n"
            for skill, progress in skills.items():
                display += f"• {skill}: {progress}%\n"
        
        # Weekly progress
        weekly = stats.get('weekly_progress', [])
        if weekly:
            display += "\n**주간 학습 현황:**\n"
            for day_data in weekly[-7:]:  # Last 7 days
                date = day_data.get('date', 'Unknown')
                conversations = day_data.get('conversations', 0)
                display += f"• {date}: {conversations}회 대화\n"
        
        return display
    
    def create_interface(self) -> gr.Blocks:
        """Create the main Gradio interface"""
        
        with gr.Blocks(
            theme=gr.themes.Soft(),
            title="한국어 학습 챗봇 (Korean Learning Chatbot)",
            css="""
            .main-container { max-width: 1200px; margin: 0 auto; }
            .chat-container { height: 600px; }
            .progress-container { height: 400px; overflow-y: auto; }
            .stats-container { height: 300px; overflow-y: auto; }
            """
        ) as interface:
            
            gr.Markdown(
                """
                # 🇰🇷 한국어 학습 챗봇 (Korean Learning Chatbot)
                
                안녕하세요! 한국어 학습을 도와드리는 AI 챗봇입니다.
                Hello! I'm an AI chatbot here to help you learn Korean.
                """
            )
            
            with gr.Row():
                with gr.Column(scale=2):
                    # User settings
                    with gr.Group():
                        gr.Markdown("### 👤 사용자 설정 (User Settings)")
                        user_id = gr.Textbox(
                            label="사용자 ID (User ID)",
                            placeholder="예: student123",
                            value="default_user"
                        )
                        level = gr.Dropdown(
                            choices=settings.SUPPORTED_LEVELS,
                            label="학습 레벨 (Learning Level)",
                            value="beginner"
                        )
                    
                    # Main chat interface
                    with gr.Group():
                        gr.Markdown("### 💬 대화 (Chat)")
                        chatbot = gr.Chatbot(
                            label="한국어 학습 대화",
                            height=500,
                            elem_classes=["chat-container"],
                            # type="messages"
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
                    # Progress tracking
                    with gr.Group():
                        gr.Markdown("### 📊 학습 진도 (Progress)")
                        progress_display = gr.Markdown(
                            "진도 정보를 불러오는 중...",
                            elem_classes=["progress-container"]
                        )
                        refresh_progress_btn = gr.Button("진도 새로고침 (Refresh Progress)")
                    
                    # Detailed statistics
                    with gr.Group():
                        gr.Markdown("### 📈 상세 통계 (Detailed Stats)")
                        stats_display = gr.Markdown(
                            "통계를 보려면 버튼을 클릭하세요.",
                            elem_classes=["stats-container"]
                        )
                        show_stats_btn = gr.Button("통계 보기 (Show Stats)")
            
            # Quick tips section
            with gr.Accordion("💡 사용 팁 (Usage Tips)", open=False):
                gr.Markdown(
                    """
                    **문법 검사:** "이 문장이 맞나요?" + 한국어 문장
                    **어휘 학습:** "~의 뜻이 뭐예요?" 또는 "vocabulary practice"
                    **발음 도움:** "~은/는 어떻게 발음해요?"
                    **문화 설명:** "한국 문화에서 ~은/는 어떤 의미예요?"
                    
                    **Grammar Check:** "Is this sentence correct?" + Korean sentence
                    **Vocabulary:** "What does ~ mean?" or "vocabulary practice"
                    **Pronunciation:** "How do you pronounce ~?"
                    **Culture:** "What does ~ mean in Korean culture?"
                    """
                )
            
            # Event handlers
            def handle_send(message, history, user_id, level, progress):
                return self.chat_with_bot(message, history, user_id, level, progress)
            
            def handle_clear(user_id, level):
                return self.clear_chat(user_id, level)
            
            def handle_level_change(user_id, level):
                return self.change_level(user_id, level)
            
            def handle_show_stats(user_id, level):
                return self.get_learning_stats(user_id, level)
            
            def handle_refresh_progress(user_id, level):
                agent = self.initialize_agent(user_id, level)
                progress = agent.progress_tracker.get_progress_summary()
                return self._format_progress_display(progress)
            
            # Connect events
            send_btn.click(
                fn=handle_send,
                inputs=[message_input, chatbot, user_id, level, progress_display],
                outputs=[message_input, chatbot, progress_display]
            )
            
            message_input.submit(
                fn=handle_send,
                inputs=[message_input, chatbot, user_id, level, progress_display],
                outputs=[message_input, chatbot, progress_display]
            )
            
            clear_btn.click(
                fn=handle_clear,
                inputs=[user_id, level],
                outputs=[chatbot, progress_display]
            )
            
            level_change_btn.click(
                fn=handle_level_change,
                inputs=[user_id, level],
                outputs=[progress_display]
            )
            
            show_stats_btn.click(
                fn=handle_show_stats,
                inputs=[user_id, level],
                outputs=[stats_display]
            )
            
            refresh_progress_btn.click(
                fn=handle_refresh_progress,
                inputs=[user_id, level],
                outputs=[progress_display]
            )
        
        return interface
    
    def launch(self, share: bool = True, debug: bool = False):
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