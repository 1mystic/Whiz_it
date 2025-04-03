import json

import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv() # Load environment variables from .env

# Configure the Generative AI client
gemini_api_key = os.getenv("GOOGLE_API_KEY")
if not gemini_api_key:
    print("Warning: GOOGLE_API_KEY environment variable not set. AI features will be disabled.")
    # Handle this case appropriately - maybe disable the report generation
else:
    genai.configure(api_key=gemini_api_key)
    model = genai.GenerativeModel('gemini-2.0-flash') 



# --- AI Report Generation Function (keep as before) ---
def generate_ai_report(quiz_title, questions_data, score_percentage):
    """Generates an AI report using Google Gemini."""
    if not model:  # Check if model is initialized
        print("AI Report generation skipped: Model not available.")
        return json.dumps({
            "summary": "AI analysis is currently unavailable.",
            "strengths": [],
            "weaknesses": [],
            "suggestions": ["Please review your answers manually."]
        })

    prompt = f"""
    Analyze the following quiz results and provide an insightful report in JSON format.
    The user attempted a quiz titled "{quiz_title}" and scored {score_percentage:.2f}%.

    Here's a breakdown of the questions, the user's selected options, and the correct options:
    """
    for item in questions_data:
        prompt += f"\n- Question: {item['question']}\n"
        prompt += f"  User's Answer: {item['selected_option']}\n"
        prompt += f"  Correct Answer: {item['correct_option']}\n"
        prompt += f"  Outcome: {'Correct' if item['selected_option'] == item['correct_option'] else 'Incorrect'}\n"

    prompt += """
    Based on this information, provide a JSON object with the following keys:
    - "summary": A brief overall summary of the user's performance (2-3 sentences).
    - "strengths": A list of topics or types of questions the user seems to understand well (based on correct answers). If none are obvious, provide an encouraging remark.
    - "weaknesses": A list of topics or types of questions where the user struggled (based on incorrect answers). Be constructive.
    - "suggestions": A list of actionable suggestions for improvement, possibly mentioning specific areas from the 'weaknesses'.

    Return ONLY the raw JSON with no markdown formatting, code blocks, or other text. Ensure the output is valid JSON.
    Also the response should have a conversational tone as if you are directly guiding the user from a mentor's perspective.
    """

    try:
        response = model.generate_content(prompt)
        response_text = response.text.strip()
        
        # Remove markdown code block if present
        if response_text.startswith("```") and "```" in response_text[3:]:
            # Find the first code block
            start_pos = response_text.find("\n") + 1
            end_pos = response_text.rfind("```")
            # Extract just the JSON content
            json_text = response_text[start_pos:end_pos].strip()
        else:
            json_text = response_text
            
        # Attempt to parse the response to validate JSON
        parsed_report = json.loads(json_text)
        
        # Ensure the expected keys exist, even if empty lists/strings
        parsed_report.setdefault("summary", "AI analysis generated, but summary missing.")
        parsed_report.setdefault("strengths", [])
        parsed_report.setdefault("weaknesses", [])
        parsed_report.setdefault("suggestions", [])
        
        return json.dumps(parsed_report)  # Return the validated/parsed JSON string

    except json.JSONDecodeError as e:
        print(f"AI Warning: Response was not valid JSON: {response_text}")
        print(f"JSON parsing error: {e}")
        fallback_report = json.dumps({
            "summary": "AI analysis could not be parsed correctly.",
            "strengths": [],
            "weaknesses": [],
            "suggestions": ["Please review your answers manually."]
        })
        return fallback_report
    except Exception as e:
        print(f"Error generating AI report: {e}")
        error_report = json.dumps({
            "summary": f"An error occurred during AI analysis.",
            "strengths": [],
            "weaknesses": [],
            "suggestions": ["Please review your answers manually."]
        })
        return error_report

#List the available models
#for m in genai.list_models():
   # if 'generateContent' in m.supported_generation_methods:
    #    print(m.name)

print("AI report generation function defined successfully.")
result = generate_ai_report("Sample Quiz", [{"question": "What is 2+2?", "selected_option": "4", "correct_option": "4"}], 100)  
print("AI Report Generation Result:")
print(result)  # Print the result of the AI report generation