import { BaseEditor } from '@/components/base-editor/BaseEditor';

export default function EditorPage() {
  return (
    <div className="min-h-screen bg-gray-900 overflow-hidden">
      {/* Mobile-first COC-style editor */}
      <div className="relative w-full h-screen">
        <BaseEditor />
      </div>
    </div>
  );
}
