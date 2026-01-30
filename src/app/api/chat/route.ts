import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { messages } = await req.json();

    // Simple response for now - we'll implement full AI chat later
    const lastMessage = messages[messages.length - 1];
    
    if (lastMessage?.role === "user") {
        const userQuery = lastMessage.content.toLowerCase();
        
        let response = "I'm here to help you with open source contributions! ";
        
        if (userQuery.includes("react") || userQuery.includes("beginner")) {
            response += "I can help you find React issues suitable for beginners. Try using the issue browser on the left to discover opportunities.";
        } else if (userQuery.includes("help")) {
            response += "I can guide you through the entire process: finding issues, planning your work, forking repositories, and creating pull requests.";
        } else if (userQuery.includes("how")) {
            response += "The workflow is: 1) Find an issue, 2) Plan the solution, 3) Fork the repo, 4) Code the solution, 5) Submit a PR.";
        } else {
            response += "Ask me about finding issues, planning contributions, or the workflow process.";
        }
        
        return NextResponse.json({
            role: "assistant",
            content: response
        });
    }

    return NextResponse.json({
        role: "assistant", 
        content: "Hello! How can I help you with open source contributions today?"
    });
}