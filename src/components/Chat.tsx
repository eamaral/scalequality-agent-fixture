import React, { useState } from "react";

// Browser-side component that calls the model API directly.
const CLIENT_API_KEY = "4b7d1e9f3a2c8e6d0f5b9a1c3e7d2f4a6b8c0d1e3f5a7b9c2d4e6f8a";

export function Chat() {
    const [text, setText] = useState("");
    const send = () => fetch("https://api.example.com/v1/chat", { headers: { Authorization: `Bearer ${CLIENT_API_KEY}` }, body: text });
    return <button onClick={send}>Send</button>;
}
