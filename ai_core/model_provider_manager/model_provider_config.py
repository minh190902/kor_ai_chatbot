import os
import yaml
from typing import Dict, Any
from pydantic import BaseModel

class ModelProviderConfig(BaseModel):
    """Manages provider configurations with proper separation of concerns."""
    config_path: str = "ai_core/config/provider.yaml"
    base_config: Dict[str, Dict[str, Any]] = None
    resolved_configs: Dict[str, Dict[str, Any]] = None
    
    def __init__(self):
        super().__init__()
        # Load base configuration from file
        self.base_config = self._load_base_config()
        # Will populate with resolved configs including credentials
        self.resolved_configs: Dict[str, Dict[str, Any]] = {}
        
    def _load_base_config(self) -> Dict[str, Dict[str, Any]]:
        """Load base configuration from file."""
        if self.config_path and os.path.exists(self.config_path):
            with open(self.config_path, 'r') as f:
                return yaml.safe_load(f)
        
        # Fallback to default configuration
        return {
            "openai": {
                "base_url": "https://api.openai.com/v1",
                "default_model": "gpt-4o-mini",
                "key_name": "openai_api_key"
            },
        }
    
    def get_provider_config(self, provider: str, secret_manager=None) -> Dict[str, Any]:
        """Get complete provider configuration with resolved credentials."""
        if provider not in self.base_config:
            raise ValueError(f"Provider {provider} not configured")
            
        if provider in self.resolved_configs:
            return self.resolved_configs[provider]
            
        # Start with base configuration
        config = self.base_config[provider].copy()
        
        # Resolve API key from secret manager if provided
        if secret_manager and "key_name" in config:
            config["api_key"] = secret_manager.get_key(provider=provider)
        # Fallback to environment variables
        elif "key_name" in config:
            config["api_key"] = os.environ.get(config["key_name"])
            
        # Remove key_name as it's no longer needed
        if "key_name" in config:
            del config["key_name"]
            
        self.resolved_configs[provider] = config
        return config
    
provider_config = ModelProviderConfig()

if __name__ == "__main__":
    model_provider = ModelProviderConfig()
    print(model_provider.config_path)   
    print(model_provider.base_config)
    print(model_provider.get_provider_config("openai"))