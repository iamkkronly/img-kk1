/* --- JAVASCRIPT CODE --- */
const GEMINI_API_KEY = "AIzaSyCRym6I1qGcwSHKBVQSGcO2j_Iy6crePyw";

document.addEventListener('DOMContentLoaded', () => {
    const promptInput = document.getElementById('promptInput');
    const generateBtn = document.getElementById('generateBtn');
    const resultSection = document.getElementById('resultSection');
    const generatedImage = document.getElementById('generatedImage');
    const geminiText = document.getElementById('geminiText');
    const errorSection = document.getElementById('errorSection');
    const errorMessage = document.getElementById('errorMessage');

    generateBtn.addEventListener('click', async () => {
        const prompt = promptInput.value.trim();

        if (!prompt) {
            alert('Come on, bro! Enter a prompt to generate an image.');
            return;
        }

        // Hide any previous results/errors
        resultSection.classList.add('hidden');
        errorSection.classList.add('hidden');

        try {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-preview-image-generation:generateContent?key=${GEMINI_API_KEY}`;
            const headers = {"Content-Type": "application/json"};
            const data = {
                "contents": [{"parts": [{"text": prompt}]}],
                "generationConfig": {"response_modalities": ["IMAGE", "TEXT"]}
            };

            const response = await fetch(url, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            const parts = result.candidates?.[0]?.content?.parts || [];

            let textOutput = "";
            let imageBase64Data = null;

            for (const part of parts) {
                if (part.text) textOutput += part.text + "\n";
                if (part.inlineData) imageBase64Data = part.inlineData.data;
            }

            // Display results if successful
            if (imageBase64Data) {
                generatedImage.src = `data:image/png;base64,${imageBase64Data}`;
                generatedImage.alt = prompt;
                resultSection.classList.remove('hidden');
            } else {
                errorMessage.textContent = 'Yo, no image data received. Try again.';
                errorSection.classList.remove('hidden');
            }

            if (textOutput) {
                geminiText.textContent = textOutput.trim();
            } else {
                geminiText.textContent = 'Kaustav AI was speechless, I guess.';
            }

        } catch (error) {
            // Display error message if something went wrong
            console.error('Generation failed:', error);
            errorMessage.textContent = `❌ Generation failed, bro: ${error.message}. Try a different prompt!`;
            errorSection.classList.remove('hidden');
        }
    });
});
