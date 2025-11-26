import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { message } = body;

        if (!message) {
            return NextResponse.json(
                { response: "Please provide a message." },
                { status: 400 }
            );
        }

        // Construct URL with query parameter for GET request
        const n8nUrl = new URL("https://pahaka.app.n8n.cloud/webhook/a67618a2-2c33-4b4b-8e98-3a403534664b");
        n8nUrl.searchParams.append("chatInput", message);

        console.log("Sending request to n8n:", n8nUrl.toString());

        const response = await fetch(n8nUrl.toString(), {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`N8n webhook failed: ${response.status} ${response.statusText}`, errorText);
            throw new Error(`N8n webhook failed with status ${response.status}: ${errorText}`);
        }

        const responseText = await response.text();
        console.log("Received response from n8n:", responseText);

        let data;
        try {
            data = JSON.parse(responseText);
        } catch (e) {
            // If response is not JSON, treat the text as the response
            data = { response: responseText };
        }

        // Handle different possible response formats from n8n
        let botResponse;
        if (Array.isArray(data) && data.length > 0) {
            botResponse = data[0].output || data[0].response || data[0].text || JSON.stringify(data[0]);
        } else {
            botResponse = data.output || data.response || data.text || (typeof data === 'string' ? data : JSON.stringify(data));
        }

        return NextResponse.json({ response: botResponse });
    } catch (error: any) {
        console.error("Chatbot error details:", {
            message: error.message,
            stack: error.stack,
        });

        return NextResponse.json(
            { response: `Connection error: ${error.message}` },
            { status: 500 }
        );
    }
}
