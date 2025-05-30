```markdown
# 🇰🇷 AI Korean Learning Path Generator

A multi-agent AI system that creates personalized Korean language learning plans using CrewAI.

## 🌟 Features

- **Multi-Agent System**: Specialized AI agents for assessment, planning, tracking, and recommendations
- **Personalized Learning Plans**: Customized study schedules based on your goals and availability  
- **TOPIK Preparation**: Structured paths for Korean proficiency test preparation
- **Progress Tracking**: Monitor your learning journey and adjust plans accordingly
- **Resource Recommendations**: Curated suggestions for apps, books, and practice materials

## 🚀 Quick Start

1. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

2. **Set OpenAI API Key**
   ```bash
   # Create .env file
   echo "OPENAI_API_KEY=your_api_key_here" > .env
   ```

3. **Run the Application**
   ```bash
   python main.py
   ```

4. **Or try the demo**
   ```bash
   python demo.py
   ```

## 🏗️ Architecture

The system uses a Multi-Agent Architecture with specialized agents:

- **Assessment Agent**: Evaluates current Korean proficiency
- **Planning Agent**: Creates personalized learning schedules  
- **Progress Tracker**: Monitors learning progress and performance
- **Recommender Agent**: Suggests optimal learning resources
- **Supervisor Agent**: Coordinates all agents for optimal results

## 🤖 Tech Stack

- **AI Framework**: CrewAI for multi-agent orchestration
- **LLM**: OpenAI GPT-4 for intelligent planning
- **UI**: Gradio for interactive web interface
- **Language**: Python 3.8+

## 📚 Learning Approach

1. **Initial Assessment**: Determine current Korean level and learning goals
2. **Custom Planning**: Generate week-by-week study plans
3. **Resource Matching**: Recommend optimal learning materials
4. **Progress Monitoring**: Track advancement and adjust plans
5. **Continuous Optimization**: Improve recommendations based on performance

## 🎯 Supported Goals

- TOPIK Test Preparation (Levels 1-6)
- Business Korean Communication
- Travel & Tourism Korean
- Academic Korean
- Conversational Fluency
- Korean Media Comprehension

## 📈 Future Roadmap

- [ ] Integration with popular Korean learning platforms
- [ ] Voice recognition for pronunciation practice
- [ ] Community features and study groups  
- [ ] Mobile app development
- [ ] Advanced analytics dashboard
- [ ] Multi-language interface support

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## 📄 License

This project is licensed under the MIT License.
```

이 프로젝트는 완전한 구조를 가진 AI Korean Learning Path system입니다. 

**주요 특징:**
1. **Multi-Agent Architecture**: CrewAI를 사용한 전문화된 AI 에이전트들
2. **Modular Design**: 명확한 파일 구조와 책임 분리
3. **Gradio UI**: 직관적인 웹 인터페이스
4. **Scalable**: 쉽게 확장 가능한 아키텍처

**사용법:**
1. OpenAI API 키를 .env 파일에 설정
2. `pip install -r requirements.txt`로 의존성 설치  
3. `python main.py`로 Gradio 인터페이스 실행
4. 또는 `python demo.py`로 간단한 데모 실행

이 시스템은 문서에서 제시한 Multi-Agent System 아키텍처를 충실히 구현하면서도, 실제 동작하는 프로토타입으로 설계되었습니다.
