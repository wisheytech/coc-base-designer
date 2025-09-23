'use client';

import { BaseEditor } from '@/components/base-editor/BaseEditor';

export default function EditorPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">COC Base Editor</h1>
            <p className="text-gray-600 mt-2">
              Design your perfect Clash of Clans base layout
            </p>
          </div>
          
          <BaseEditor />
        </div>
      </div>
    </div>
  );
}
