# # core/llm/mistral_client.py

# from transformers import AutoModelForCausalLM, AutoTokenizer
# import torch


# class MistralClient:
#     def __init__(self, model_name="mistralai/Mistral-7B-Instruct-v0.3"):
#         print("🔄 Loading Mistral model...")

#         self.tokenizer = AutoTokenizer.from_pretrained(model_name)

#         self.model = AutoModelForCausalLM.from_pretrained(
#             model_name,
#             torch_dtype=torch.float16,
#             device_map="auto"  # GPU if available
#         )

#     def generate(self, prompt, max_tokens=512, temperature=0.7):
#         inputs = self.tokenizer(prompt, return_tensors="pt").to(self.model.device)

#         outputs = self.model.generate(
#             **inputs,
#             max_new_tokens=max_tokens,
#             temperature=temperature,
#             do_sample=True
#         )

#         response = self.tokenizer.decode(outputs[0], skip_special_tokens=True)

#         # Remove prompt from output
#         return response[len(prompt):].strip()
 # core/llm/mistral_client.py
from mistralai.client import Mistral

class MistralClient:
    def __init__(self, api_key, model="mistral-small-latest"):
        self.client = Mistral(api_key=api_key)
        self.model = model

    def generate(self, prompt, temperature=0.7, max_tokens=1024):
        response = self.client.chat.complete(
            model=self.model,
            messages=[
                {"role": "user", "content": prompt}
            ],
            temperature=temperature,
            max_tokens=max_tokens
        )
        return response.choices[0].message.content