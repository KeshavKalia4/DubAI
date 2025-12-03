'use client';

import { useState } from 'react';
import ChatInterface from '../../components/ChatInterface';

export default function UserPage() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return <ChatInterface isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />;
}