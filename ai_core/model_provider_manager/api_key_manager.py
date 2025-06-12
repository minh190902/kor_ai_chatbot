import os
import random
from typing import Dict, List

from .model_provider_config import provider_config

class LLMKeyManager:
    """Class to manage multiple API keys for LLM providers with load balancing and rotation."""
    
    def __init__(self):
        """Initialize the key manager by loading keys from environment."""
        # Find all keys with our naming pattern
        self.keys: Dict[str, List[str]] = {}
        
        llm_config = provider_config.base_config
        providers = list(llm_config.keys())
        # Populate keys from environment variables
        for provider in providers:
            self.keys[provider] = []
            for key, value in os.environ.items():
                if key.lower().startswith(f"{llm_config[provider]['key_name']}") and value:
                    self.keys[provider].append(value)
        # Validate we have at least one key for each provider
        # missing_providers = [provider for provider, keys in self.keys.items() if not keys]
        # if missing_providers:
        #     raise EnvironmentError(f"Missing API keys for: {', '.join(missing_providers)}")
        
        # Track key usage for better distribution
        self.usage_count: Dict[str, Dict[str, int]] = {
            provider: {key: 0 for key in provider_keys}
            for provider, provider_keys in self.keys.items()
        }
    
    def get_key(self, provider: str, strategy: str = "round_robin") -> str:
        """Get an API key for a specific provider using the specified strategy.
        
        Args:
            provider: The LLM provider name (openai, anthropic, gemini, ...)
            strategy: Key selection strategy ('round_robin', 'random', or 'least_used')
            
        Returns:
            The API key
            
        Raises:
            ValueError: If provider is not supported
        """
        if provider not in self.keys:
            raise ValueError(f"Unsupported provider: {provider}")
        
        provider_keys = self.keys[provider]
        
        if strategy == "random":
            return random.choice(provider_keys)
        
        elif strategy == "least_used":
            # Select the key with the lowest usage count
            key_index = min(range(len(provider_keys)), 
                           key=lambda i: self.usage_count[provider][provider_keys[i]])
            selected_key = provider_keys[key_index]
            
        else:  # Default to round-robin
            # Get current counts
            current_counts = [self.usage_count[provider][k] for k in provider_keys]
            # Find index of key with lowest count
            key_index = current_counts.index(min(current_counts))
            selected_key = provider_keys[key_index]
        
        # Update usage count
        self.usage_count[provider][selected_key] += 1
        
        return selected_key
    
    def get_all_keys(self, provider: str) -> List[str]:
        """Get all API keys for a specific provider.
        
        Args:
            provider: The LLM provider name
            
        Returns:
            List of API keys
            
        Raises:
            ValueError: If provider is not supported
        """
        if provider not in self.keys:
            raise ValueError(f"Unsupported provider: {provider}")
        
        return self.keys[provider]

llm_key_manager = LLMKeyManager()

if __name__ == "__main__":
    llm_key_manager = LLMKeyManager()
    for i in range(5):
        # print(llm_key_manager.keys)
        print(llm_key_manager.usage_count)
        llm_key_manager.get_key('openai')
        # print(llm_key_manager.get_all_keys('openai'))