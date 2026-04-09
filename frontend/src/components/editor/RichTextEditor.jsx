import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { CodeBlockLowlight } from "@tiptap/extension-code-block-lowlight";
import Placeholder from "@tiptap/extension-placeholder";
import { createLowlight, common } from "lowlight";
import {
  Bold,
  Italic,
  UnderlineIcon,
  List,
  ListOrdered,
  Code,
  Code2,
  Heading1,
  Heading2,
  Heading3,
  Minus,
  RotateCcw,
  RotateCw,
} from "lucide-react";

const lowlight = createLowlight(common);

function ToolbarButton({ onClick, active, title, children }) {
  return (
    <button
      type="button"
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
      title={title}
      className={`p-1.5 rounded transition-colors ${
        active
          ? "bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-300"
          : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-gray-200"
      }`}
    >
      {children}
    </button>
  );
}

export default function RichTextEditor({
  content,
  onChange,
  editable = true,
  placeholder = "Write your notes here…",
  minHeight = "120px",
}) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      Underline,
      CodeBlockLowlight.configure({ lowlight }),
      Placeholder.configure({ placeholder }),
    ],
    content: content || null,
    editable,
    onUpdate({ editor }) {
      if (onChange) {
        onChange(editor.getJSON(), editor.getHTML());
      }
    },
  });

  if (!editor) return null;

  const iconSize = 15;

  return (
    <div
      className={`rounded-lg border ${
        editable
          ? "border-gray-200 dark:border-gray-600 focus-within:border-indigo-400 dark:focus-within:border-indigo-500"
          : "border-transparent"
      } bg-white dark:bg-gray-800 overflow-hidden`}
    >
      {editable && (
        <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            active={editor.isActive("bold")}
            title="Bold"
          >
            <Bold size={iconSize} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            active={editor.isActive("italic")}
            title="Italic"
          >
            <Italic size={iconSize} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            active={editor.isActive("underline")}
            title="Underline"
          >
            <UnderlineIcon size={iconSize} />
          </ToolbarButton>

          <span className="w-px h-4 bg-gray-200 dark:bg-gray-700 mx-0.5" />

          <ToolbarButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            active={editor.isActive("heading", { level: 1 })}
            title="Heading 1"
          >
            <Heading1 size={iconSize} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            active={editor.isActive("heading", { level: 2 })}
            title="Heading 2"
          >
            <Heading2 size={iconSize} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            active={editor.isActive("heading", { level: 3 })}
            title="Heading 3"
          >
            <Heading3 size={iconSize} />
          </ToolbarButton>

          <span className="w-px h-4 bg-gray-200 dark:bg-gray-700 mx-0.5" />

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            active={editor.isActive("bulletList")}
            title="Bullet list"
          >
            <List size={iconSize} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            active={editor.isActive("orderedList")}
            title="Numbered list"
          >
            <ListOrdered size={iconSize} />
          </ToolbarButton>

          <span className="w-px h-4 bg-gray-200 dark:bg-gray-700 mx-0.5" />

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCode().run()}
            active={editor.isActive("code")}
            title="Inline code"
          >
            <Code size={iconSize} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            active={editor.isActive("codeBlock")}
            title="Code block"
          >
            <Code2 size={iconSize} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            active={false}
            title="Divider"
          >
            <Minus size={iconSize} />
          </ToolbarButton>

          <span className="w-px h-4 bg-gray-200 dark:bg-gray-700 mx-0.5" />

          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            active={false}
            title="Undo"
          >
            <RotateCcw size={iconSize} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            active={false}
            title="Redo"
          >
            <RotateCw size={iconSize} />
          </ToolbarButton>
        </div>
      )}

      <EditorContent
        editor={editor}
        className="px-3 py-2 text-sm text-gray-800 dark:text-gray-200 focus:outline-none"
        style={{ minHeight }}
      />
    </div>
  );
}
