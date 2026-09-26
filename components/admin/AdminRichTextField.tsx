"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import { useEffect, useId, useState, type ReactNode } from "react";
import { isValidAdminLinkUrl } from "@/lib/sanitize";

type Props = {
  name: string;
  labelId: string;
  defaultValue?: string;
  placeholder?: string;
};

/**
 * 관리자 웹에디터 — 나무말미식 아이콘 툴바 + TipTap
 */
export function AdminRichTextField({
  name,
  labelId,
  defaultValue = "",
  placeholder = "본문 내용을 입력하세요.",
}: Props) {
  const styleId = useId().replace(/:/g, "");
  const [html, setHtml] = useState(defaultValue);
  const [, setTick] = useState(0);
  const refresh = () => setTick((n) => n + 1);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        // StarterKit(v3)에 포함된 link/underline과 별도 확장 중복 방지
        link: false,
        underline: false,
      }),
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { rel: "noopener noreferrer" },
      }),
      Placeholder.configure({ placeholder }),
    ],
    content: defaultValue || "",
    onUpdate: ({ editor: ed }) => {
      setHtml(ed.isEmpty ? "" : ed.getHTML());
      refresh();
    },
    onSelectionUpdate: () => refresh(),
    onTransaction: () => refresh(),
    onCreate: ({ editor: ed }) => {
      setHtml(ed.isEmpty ? "" : ed.getHTML());
    },
    editorProps: {
      attributes: {
        class: "admin-tiptap-editor",
        "data-admin-focus": "true",
        "aria-labelledby": labelId,
      },
    },
  });

  useEffect(() => {
    if (!editor) return;
    setHtml(editor.isEmpty ? "" : editor.getHTML());
  }, [editor]);

  function setLink() {
    if (!editor) return;
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("링크 URL을 입력하세요.", prev ?? "https://");
    if (url === null) return;
    if (!url.trim()) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    if (!isValidAdminLinkUrl(url)) {
      window.alert("올바른 링크 URL을 입력해 주세요.");
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url.trim() }).run();
  }

  function setBlock(kind: "paragraph" | "h2" | "h3") {
    if (!editor) return;
    if (kind === "paragraph") {
      editor.chain().focus().setParagraph().run();
      return;
    }
    editor
      .chain()
      .focus()
      .toggleHeading({ level: kind === "h2" ? 2 : 3 })
      .run();
  }

  const blockLabel = !editor
    ? "본문"
    : editor.isActive("heading", { level: 2 })
      ? "제목"
      : editor.isActive("heading", { level: 3 })
        ? "소제목"
        : "본문";

  return (
    <div data-admin-editor-surface className="w-full">
      <style>{`
        #admin-tiptap-${styleId} .admin-tiptap-editor {
          min-height: 240px;
          padding: 14px 16px;
          font-size: 14px;
          line-height: 1.75;
          color: #262626;
          outline: none;
        }
        #admin-tiptap-${styleId} .admin-tiptap-editor p { margin: 0 0 0.7em; }
        #admin-tiptap-${styleId} .admin-tiptap-editor p:last-child { margin-bottom: 0; }
        #admin-tiptap-${styleId} .admin-tiptap-editor h2 {
          margin: 0.9em 0 0.45em;
          font-size: 1.2rem;
          font-weight: 700;
        }
        #admin-tiptap-${styleId} .admin-tiptap-editor h3 {
          margin: 0.8em 0 0.4em;
          font-size: 1.05rem;
          font-weight: 700;
        }
        #admin-tiptap-${styleId} .admin-tiptap-editor ul { list-style: disc; padding-left: 1.4rem; margin: 0.45em 0; }
        #admin-tiptap-${styleId} .admin-tiptap-editor ol { list-style: decimal; padding-left: 1.4rem; margin: 0.45em 0; }
        #admin-tiptap-${styleId} .admin-tiptap-editor blockquote {
          margin: 0.6em 0;
          padding-left: 0.9rem;
          border-left: 3px solid #cfc9c0;
          color: #555;
        }
        #admin-tiptap-${styleId} .admin-tiptap-editor code {
          border-radius: 3px;
          background: #f3f1ee;
          padding: 0.1em 0.35em;
          font-size: 0.92em;
        }
        #admin-tiptap-${styleId} .admin-tiptap-editor a { color: #5a554c; text-decoration: underline; }
        #admin-tiptap-${styleId} .admin-tiptap-editor p.is-editor-empty:first-child::before {
          color: #9ca3af;
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
        }
      `}</style>
      <input type="hidden" name={name} value={html} readOnly />
      <div
        id={`admin-tiptap-${styleId}`}
        className="overflow-hidden rounded border border-black/20 bg-white"
      >
        <div
          role="toolbar"
          aria-label="본문 서식"
          className="flex flex-wrap items-center gap-0.5 border-b border-black/15 bg-[#5a554c] px-1.5 py-1"
        >
          {!editor ? (
            <span className="px-2 py-1.5 text-xs text-white/70">에디터 준비 중…</span>
          ) : (
            <>
              <ToolBtn
                label="실행 취소"
                active={false}
                disabled={!editor.can().undo()}
                onClick={() => editor.chain().focus().undo().run()}
              >
                <IconUndo />
              </ToolBtn>
              <ToolBtn
                label="다시 실행"
                active={false}
                disabled={!editor.can().redo()}
                onClick={() => editor.chain().focus().redo().run()}
              >
                <IconRedo />
              </ToolBtn>

              <Sep />

              <BlockSelect
                label={blockLabel}
                onChange={(v) => setBlock(v)}
              />

              <Sep />

              <ToolBtn
                label="글머리 기호"
                active={editor.isActive("bulletList")}
                onClick={() => editor.chain().focus().toggleBulletList().run()}
              >
                <IconBulletList />
              </ToolBtn>
              <ToolBtn
                label="번호 매기기"
                active={editor.isActive("orderedList")}
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
              >
                <IconOrderedList />
              </ToolBtn>
              <ToolBtn
                label="인용"
                active={editor.isActive("blockquote")}
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
              >
                <IconQuote />
              </ToolBtn>

              <Sep />

              <ToolBtn
                label="굵게"
                active={editor.isActive("bold")}
                onClick={() => editor.chain().focus().toggleBold().run()}
              >
                <IconBold />
              </ToolBtn>
              <ToolBtn
                label="기울임"
                active={editor.isActive("italic")}
                onClick={() => editor.chain().focus().toggleItalic().run()}
              >
                <IconItalic />
              </ToolBtn>
              <ToolBtn
                label="취소선"
                active={editor.isActive("strike")}
                onClick={() => editor.chain().focus().toggleStrike().run()}
              >
                <IconStrike />
              </ToolBtn>
              <ToolBtn
                label="코드"
                active={editor.isActive("code")}
                onClick={() => editor.chain().focus().toggleCode().run()}
              >
                <IconCode />
              </ToolBtn>
              <ToolBtn
                label="밑줄"
                active={editor.isActive("underline")}
                onClick={() => editor.chain().focus().toggleUnderline().run()}
              >
                <IconUnderline />
              </ToolBtn>
              <ToolBtn
                label="서식 지우기"
                active={false}
                onClick={() =>
                  editor.chain().focus().unsetAllMarks().clearNodes().run()
                }
              >
                <IconEraser />
              </ToolBtn>
              <ToolBtn
                label="링크"
                active={editor.isActive("link")}
                onClick={setLink}
              >
                <IconLink />
              </ToolBtn>

              <Sep />

              <ToolBtn
                label="왼쪽 정렬"
                active={editor.isActive({ textAlign: "left" })}
                onClick={() => editor.chain().focus().setTextAlign("left").run()}
              >
                <IconAlignLeft />
              </ToolBtn>
              <ToolBtn
                label="가운데 정렬"
                active={editor.isActive({ textAlign: "center" })}
                onClick={() =>
                  editor.chain().focus().setTextAlign("center").run()
                }
              >
                <IconAlignCenter />
              </ToolBtn>
              <ToolBtn
                label="오른쪽 정렬"
                active={editor.isActive({ textAlign: "right" })}
                onClick={() =>
                  editor.chain().focus().setTextAlign("right").run()
                }
              >
                <IconAlignRight />
              </ToolBtn>
              <ToolBtn
                label="양쪽 정렬"
                active={editor.isActive({ textAlign: "justify" })}
                onClick={() =>
                  editor.chain().focus().setTextAlign("justify").run()
                }
              >
                <IconAlignJustify />
              </ToolBtn>
            </>
          )}
        </div>
        {editor ? (
          <EditorContent editor={editor} />
        ) : (
          <div className="min-h-[240px] px-4 py-3.5 text-sm text-[#9ca3af]">
            {placeholder}
          </div>
        )}
      </div>
    </div>
  );
}

function Sep() {
  return <span className="mx-0.5 h-5 w-px bg-white/25" aria-hidden />;
}

function ToolBtn({
  label,
  active,
  disabled,
  onClick,
  children,
}: {
  label: string;
  active: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex h-8 w-8 items-center justify-center rounded text-white transition ${
        active ? "bg-white/25" : "hover:bg-white/15"
      } disabled:cursor-not-allowed disabled:opacity-35`}
    >
      {children}
    </button>
  );
}

function BlockSelect({
  label,
  onChange,
}: {
  label: string;
  onChange: (v: "paragraph" | "h2" | "h3") => void;
}) {
  return (
    <label className="relative inline-flex h-8 items-center">
      <span className="sr-only">문단 스타일</span>
      <select
        aria-label="문단 스타일"
        value={
          label === "제목" ? "h2" : label === "소제목" ? "h3" : "paragraph"
        }
        onChange={(e) =>
          onChange(e.target.value as "paragraph" | "h2" | "h3")
        }
        className="h-8 cursor-pointer appearance-none rounded border-0 bg-white/10 py-0 pl-2.5 pr-7 text-xs font-medium text-white outline-none hover:bg-white/15"
      >
        <option value="paragraph" className="text-[#262626]">
          본문
        </option>
        <option value="h2" className="text-[#262626]">
          제목
        </option>
        <option value="h3" className="text-[#262626]">
          소제목
        </option>
      </select>
      <span className="pointer-events-none absolute right-1.5 text-[10px] text-white/80">
        ▾
      </span>
    </label>
  );
}

function IconUndo() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M9 14 4 9l5-5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H12" strokeLinecap="round" />
    </svg>
  );
}
function IconRedo() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="m15 14 5-5-5-5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20 9H9.5a5.5 5.5 0 0 0 0 11H12" strokeLinecap="round" />
    </svg>
  );
}
function IconBulletList() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <circle cx="4" cy="6" r="1.5" />
      <circle cx="4" cy="12" r="1.5" />
      <circle cx="4" cy="18" r="1.5" />
      <rect x="8" y="5" width="13" height="2" rx="1" />
      <rect x="8" y="11" width="13" height="2" rx="1" />
      <rect x="8" y="17" width="13" height="2" rx="1" />
    </svg>
  );
}
function IconOrderedList() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <text x="1" y="8" fontSize="7" fontFamily="system-ui">1</text>
      <text x="1" y="14" fontSize="7" fontFamily="system-ui">2</text>
      <text x="1" y="20" fontSize="7" fontFamily="system-ui">3</text>
      <rect x="8" y="5" width="13" height="2" rx="1" />
      <rect x="8" y="11" width="13" height="2" rx="1" />
      <rect x="8" y="17" width="13" height="2" rx="1" />
    </svg>
  );
}
function IconQuote() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M7.2 18c1.9 0 3.3-1.5 3.3-3.4 0-1.8-1.2-3.1-2.9-3.1-.2 0-.5 0-.7.1.4-1.5 1.7-2.7 3.4-3.2L9.5 6C6.2 6.8 4 9.3 4 12.8 4 15.9 5.7 18 7.2 18zm9 0c1.9 0 3.3-1.5 3.3-3.4 0-1.8-1.2-3.1-2.9-3.1-.2 0-.5 0-.7.1.4-1.5 1.7-2.7 3.4-3.2L18.5 6C15.2 6.8 13 9.3 13 12.8c0 3.1 1.7 5.2 3.2 5.2z" />
    </svg>
  );
}
function IconBold() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M7 5h6.2c2.4 0 4.1 1.4 4.1 3.5 0 1.5-.8 2.6-2.1 3.1 1.7.5 2.8 1.8 2.8 3.6C18 17.6 16 19 13.3 19H7V5zm3.1 5.5h2.6c1.1 0 1.7-.5 1.7-1.3s-.6-1.3-1.7-1.3h-2.6v2.6zm0 5.9h3c1.2 0 1.9-.6 1.9-1.5s-.7-1.5-1.9-1.5h-3v3z" />
    </svg>
  );
}
function IconItalic() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M14.5 5h-4l-.4 2h1.4l-2.6 10H7.5l-.4 2h4l.4-2H9.9l2.6-10h1.6l.4-2z" />
    </svg>
  );
}
function IconStrike() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M4 11h16v2H4v-2zm7.2-5c2.4 0 4 1.1 4 3h-2.1c0-.8-.7-1.3-1.9-1.3-1.1 0-1.8.4-1.8 1.1 0 .4.2.7.7 1H4.9C4.5 8.5 5.8 6 11.2 6zM9.6 15.2c0 .9.8 1.4 2 1.4 1.3 0 2.1-.6 2.1-1.5h2.1c0 2.1-1.6 3.4-4.2 3.4-2.7 0-4.3-1.2-4.3-3.2 0-.4.1-.8.2-1.1h2.1c0 .4 0 .8 0 1z" />
    </svg>
  );
}
function IconCode() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="m8 8-4 4 4 4M16 8l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconUnderline() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M6 19h12v2H6v-2zm6-2.5c-2.8 0-5-2.1-5-5.1V4h2.2v7.3c0 1.7 1.2 2.9 2.8 2.9s2.8-1.2 2.8-2.9V4H17v7.4c0 3-2.2 5.1-5 5.1z" />
    </svg>
  );
}
function IconEraser() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="m7 21-4.3-4.3a1 1 0 0 1 0-1.4l9.6-9.6a1 1 0 0 1 1.4 0l5.6 5.6a1 1 0 0 1 0 1.4L12 21H7z" strokeLinejoin="round" />
      <path d="M5 13h10" strokeLinecap="round" />
    </svg>
  );
}
function IconLink() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" strokeLinecap="round" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" strokeLinecap="round" />
    </svg>
  );
}
function IconAlignLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <rect x="3" y="5" width="18" height="2" rx="1" />
      <rect x="3" y="11" width="12" height="2" rx="1" />
      <rect x="3" y="17" width="16" height="2" rx="1" />
    </svg>
  );
}
function IconAlignCenter() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <rect x="3" y="5" width="18" height="2" rx="1" />
      <rect x="6" y="11" width="12" height="2" rx="1" />
      <rect x="4" y="17" width="16" height="2" rx="1" />
    </svg>
  );
}
function IconAlignRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <rect x="3" y="5" width="18" height="2" rx="1" />
      <rect x="9" y="11" width="12" height="2" rx="1" />
      <rect x="5" y="17" width="16" height="2" rx="1" />
    </svg>
  );
}
function IconAlignJustify() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <rect x="3" y="5" width="18" height="2" rx="1" />
      <rect x="3" y="11" width="18" height="2" rx="1" />
      <rect x="3" y="17" width="18" height="2" rx="1" />
    </svg>
  );
}
