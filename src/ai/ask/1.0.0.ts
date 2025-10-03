import axios from 'axios';

const artificial = async (neo: any, messages: any) => {
    // appel a l'api groq
    const apiKey = process.env.GROK;

    const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
        model: "llama3-8b-8192",
        messages
    }, {
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        }
    });

    const result = JSON.parse(response.data.choices[0].message.content);
    return { role: neo.org , content: result };
}

export default artificial;