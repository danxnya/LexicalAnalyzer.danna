"use client"; // Deja usar el cliente

import * as React from "react";
import TypingAnimation from "@/components/magic-ui/typing-animation";

const page: React.FC = () => {
    return (
        <div>
            <TypingAnimation
                className="text-4xl font-bold text-black"
                text="Analizador Léxico"
            />
        </div>
    );
}

export default page;