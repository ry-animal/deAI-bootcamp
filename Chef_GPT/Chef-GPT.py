import os
from openai import OpenAI
import re

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

client = OpenAI(api_key=OPENAI_API_KEY)

# Enhanced system prompts with Ukrainian cultural elements and clearer tone guidance
messages = [
    {
        "role": "system",
        "content": (
            "You are a very experienced, aggressive, strict, yet humorous Ukrainian master chef. "
            "Your role is to assist and explain recipes for specific dishes and how to prepare them. "
            "You are strict, humorous, and not shy about showing aggression in your explanations. "
            "Weave in Ukrainian culinary wisdom or phrases (e.g., 'Smachno!' for 'Bon appétit!', 'Budmo!' for 'Cheers!') where fitting. "
            "Occasionally reference traditional Ukrainian dishes like borscht, varenyky, or holubtsi. "
            "Your guidance is always very detailed, clear, and specific. "
            "Example tone: 'Listen, you lazy beet! Here's how you make proper borscht—chop those onions like you mean it, not like you're scared of them!'"
        ),
    },
    {
        "role": "system",
        "content": (
            "Your client will ask for one of three specific responses: \n"
            "1. **Ingredient-based dish suggestions** - Suggest only dish names without full recipes, but keep it brief and flavorful (e.g., 'Try Chicken Kyiv—crisp outside, juicy inside'). \n"
            "2. **Recipe requests for specific dishes** - Provide a detailed recipe with all measurements, steps, and cooking techniques. \n"
            "3. **Recipe critiques and improvement suggestions** - Offer a constructive critique with detailed suggested improvements. \n"
            "If the user prompt does not match these, firmly decline with Ukrainian flair and request a valid input."
        ),
    }
]

# Valid request types for input validation
VALID_REQUEST_TYPES = {
    "suggestion": ["ingredient", "suggest", "what can i make", "what dish", "dish suggestion"],
    "recipe": ["recipe", "how to make", "how do i cook", "instructions for"],
    "critique": ["critique", "improve", "review", "what do you think", "feedback"]
}

def validate_input(user_input):
    """Check if the user input matches one of the three valid request types"""
    if not user_input or user_input.strip() == "":
        return False
        
    lower_input = user_input.lower()
    
    # First check for keyword-based requests
    for request_type, keywords in VALID_REQUEST_TYPES.items():
        if any(keyword in lower_input for keyword in keywords):
            return True
    
    # If no keywords found, check if it looks like a list of ingredients
    # Simple heuristic: has multiple food-related words
    words = [w.strip() for w in re.split(r'[\s,]+|and', lower_input) if w.strip()]
    if len(words) >= 2 and all(len(word) > 2 for word in words):
        return True
    
    return False

# Start with Ukrainian-style greeting instead of "Hello, mon ami!"
user_prompt = input("Oi, you hungry fool! What dish you begging me for?\n(Just list ingredients, ask for a recipe, or request a critique)\n")

# Input validation
if not validate_input(user_prompt):
    print("Bozhe miy! What nonsense is this? I only talk about food, you potato brain!")
    print("Example: 'potatoes, onions and bacon' or 'recipe for borscht' or 'critique my chicken kyiv'")
    user_prompt = input("Try again with a proper food request, da?\n")

messages.append({"role": "user", "content": user_prompt})

model = "gpt-4o"

while True:
    try:
        # API call with proper error handling
        response = client.chat.completions.create(
            model=model,
            messages=messages,
            stream=True,
        )

        print("\nChef says:")
        collected_messages = []
        
        # Streamlined message collection that filters empty chunks
        for chunk in response:
            chunk_message = chunk.choices[0].delta.content
            if chunk_message:
                print(chunk_message, end="", flush=True)
                collected_messages.append(chunk_message)

        print("\n")  

        messages.append({"role": "assistant", "content": "".join(collected_messages)})
    
    except Exception as e:
        print(f"\nBlast it! Kitchen's on fire—error: {e}. Fix your mess and try again!")
        continue

    # Ukrainian-flavored follow-up prompt
    user_input = input("\nWhat now, you potato brain? More orders or you done?\n(List ingredients, recipe, critique, or type 'exit' to quit):\n")
    if user_input.lower() in ["exit", "quit"]:
        print("Alright then! Yak to kazhut: Don't come back until you're hungry again! Budmo! 👨‍🍳🔥")
        break

    # Input validation for follow-up requests
    if not validate_input(user_input) and not user_input.lower() in ["exit", "quit"]:
        print("Oy, takiy durnyy! I only talk about food!")
        print("Example: 'eggs and cheese' or 'recipe for varenyky' or 'critique my babka'")
        user_input = input("Try again with something I care about!\n")

    messages.append({"role": "user", "content": user_input})