"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import ImageExtension from "@tiptap/extension-image";
import { useRef } from "react";

import {
  Image as ImageIcon,
  Italic,
  Underline as UIcon,
  Bold,
  Link as LinkIcon,
  List,
  ListOrdered,
} from "lucide-react";
import { Label } from "../forms/Label";

interface Props {
  value: string;
  label: string;
  onChange: (value: string) => void;
}

export default function RichTextEditor({ value, onChange, label }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      ImageExtension,
      Link.configure({ openOnClick: false }),
    ],
    immediatelyRender: false,
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "min-h-[220px] px-4  overflow-y-auto text-sm text-gray-700 focus:outline-none " +
          "[&_strong]:font-bold [&_b]:font-bold " +
          "[&_em]:italic [&_i]:italic " +
          "[&_u]:underline " +
          "[&_ul]:list-disc [&_ul]:ml-6 [&_ol]:list-decimal [&_ol]:ml-6",
      },
    },
  });

  if (!editor) return null;

  // Add image from local file
  const addImage = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;

        const doc = editor.state.doc;
        let imagePos: number | null = null; // <-- explicit type

        // Find the first image position
        doc.descendants((node, pos) => {
          if (node.type.name === "image" && imagePos === null) {
            imagePos = pos;
          }
        });

        if (imagePos !== null) {
          // Replace existing image
          editor
            .chain()
            .focus()
            .command(({ tr }) => {
              tr.replaceWith(
                imagePos!,
                imagePos! + 1,
                editor.schema.nodes.image.create({
                  src: base64,
                  width: 100,
                  height: 100,
                }),
              );
              return true;
            })
            .run();
        } else {
          // Insert image if none exists
          editor
            .chain()
            .focus()
            .setImage({ src: base64, width: 100, height: 100 })
            .run();
        }
      };

      reader.readAsDataURL(file);
    };

    input.click();
  };

  // Add link
  const addFile = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf,.doc,.docx,.txt"; // allowed file types

    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        // Insert as a link to local file (base64)
        editor
          .chain()
          .focus()
          .insertContent(`<a href="${base64}" target="_blank">${file.name}</a>`)
          .run();
      };
      reader.readAsDataURL(file);
    };

    input.click();
  };

  return (
    <div className="w-full">
      {/* Black Title Bar */}
      <Label> {label}</Label>

      <div className="w-full border rounded-md mt-2 bg-ffffff/18 h-69.25">
        <div className="flex items-center gap-3 px-3 py-2 h-11  border-b text-gray-600">
          <button type="button" onClick={addImage} title="Add Image">
            <ImageIcon size={16} />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            title="Italic"
          >
            <Italic size={16} />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            title="Underline"
          >
            <UIcon size={16} />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            title="Bold"
          >
            <Bold size={16} />
          </button>

          <button type="button" onClick={addFile} title="Add Link">
            <LinkIcon size={16} />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            title="Bullet List"
          >
            <List size={16} />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            title="Numbered List"
          >
            <ListOrdered size={16} />
          </button>
        </div>
        <div className="w-full h-[220px] p-4 overflow-y-auto">
          <EditorContent
            editor={editor}
            className="prose prose-sm max-w-full"
          />
        </div>
      </div>
      {/* Editor Area */}
    </div>
  );
}
