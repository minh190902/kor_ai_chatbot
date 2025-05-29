"""
Main entry point for Korean Learning Chatbot
"""
import sys
import logging
from pathlib import Path

# Add src to Python path
sys.path.append(str(Path(__file__).parent / "src"))

from src.app import KoreanChatbotUI
from config.settings import settings


def setup_logging():
    """Setup logging configuration"""
    logging.basicConfig(
        level=getattr(logging, settings.LOG_LEVEL),
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[
            logging.FileHandler(settings.LOG_FILE),
            logging.StreamHandler(sys.stdout)
        ]
    )


def main():
    """Main function to run the Korean Learning Chatbot"""
    
    # Setup logging
    setup_logging()
    logger = logging.getLogger(__name__)
    
    try:
        logger.info("Starting Korean Learning Chatbot...")
        
        # Validate settings
        settings.validate_settings()
        logger.info("Settings validated successfully")
        
        # Initialize and launch UI
        chatbot_ui = KoreanChatbotUI()
        
        logger.info(f"Launching Gradio interface on {settings.GRADIO_HOST}:{settings.GRADIO_PORT}")
        
        chatbot_ui.launch(
            share=False,  # Set to True if you want public URL
            debug=True if settings.LOG_LEVEL == "DEBUG" else False
        )
        
    except KeyboardInterrupt:
        logger.info("Chatbot stopped by user")
    except Exception as e:
        logger.error(f"Error starting chatbot: {str(e)}")
        raise


if __name__ == "__main__":
    main()