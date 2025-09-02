"use client";

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { type EditorState, type SerializedEditorState } from "lexical";

import { ContentEditable } from "@/src/components/editor/editor-ui/content-editable";
import { TooltipProvider } from "@/src/components/ui/tooltip";

import { ClearEditorPlugin } from "@lexical/react/LexicalClearEditorPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { useState } from "react";
import { ActionsPlugin } from "../../editor/plugins/actions/actions-plugin";
import { ClearEditorActionPlugin } from "../../editor/plugins/actions/clear-editor-plugin";
import { FontFormatToolbarPlugin } from "../../editor/plugins/toolbar/font-format-toolbar-plugin";
import { ToolbarPlugin } from "../../editor/plugins/toolbar/toolbar-plugin";
import { Button } from "../../ui/button";
import { editorConfig } from "./editor";

export const commentInitialValue = {
  root: {
    children: [
      {
        children: [
          {
            detail: 0,
            format: 0,
            mode: "normal",
            style: "",
            text: "",
            type: "text",
            version: 1,
          },
        ],
        direction: "ltr",
        format: "",
        indent: 0,
        type: "paragraph",
        version: 1,
      },
    ],
    direction: "ltr",
    format: "",
    indent: 0,
    type: "root",
    version: 1,
  },
} as unknown as SerializedEditorState;

export function Comment({
  editorState,
  editorSerializedState,
  onChange,
  onSerializedChange,
  handleSubmit,
  isSubmitting,
}: {
  editorState?: EditorState;
  editorSerializedState?: SerializedEditorState;
  onChange?: (editorState: EditorState) => void;
  onSerializedChange?: (editorSerializedState: SerializedEditorState) => void;
  handleSubmit?: () => void;
  isSubmitting?: boolean;
}) {
  const [, setFloatingAnchorElem] = useState<HTMLDivElement | null>(null);

  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem);
    }
  };

  return (
    <div className="bg-background overflow-hidden rounded-lg border shadow">
      <LexicalComposer
        initialConfig={{
          ...editorConfig,
          ...(editorState ? { editorState } : {}),
          ...(editorSerializedState
            ? { editorState: JSON.stringify(editorSerializedState) }
            : {}),
        }}
      >
        <TooltipProvider>
          <div className="relative">
            <div className="relative">
              <RichTextPlugin
                contentEditable={
                  <div className="">
                    <div
                      className=""
                      ref={onRef}
                    >
                      <ContentEditable
                        placeholder={"Write a comment..."}
                        className="ContentEditable__root relative block h-20 p-3 overflow-auto focus:outline-none"
                      />
                    </div>
                  </div>
                }
                ErrorBoundary={LexicalErrorBoundary}
              />
            </div>

            {/* actions plugins */}
            <ActionsPlugin>
              <div className="clear-both flex items-center justify-between gap-2 p-2 overflow-auto border-t">
                <div className="flex flex-1 justify-start">
                  {/* left side action buttons */}
                  <ToolbarPlugin>
                    {({}) => (
                      <div className="vertical-align-middle sticky top-0 z-10 flex gap-1 overflow-auto border-b p-0">
                        <FontFormatToolbarPlugin format="bold" />
                        <FontFormatToolbarPlugin format="italic" />
                        <FontFormatToolbarPlugin format="underline" />
                        <FontFormatToolbarPlugin format="strikethrough" />
                      </div>
                    )}
                  </ToolbarPlugin>
                </div>
                <div>{/* center action buttons */}</div>
                <div className="flex flex-1 justify-end gap-1">
                  {/* right side action buttons */}
                  <>
                    <ClearEditorActionPlugin />
                    <ClearEditorPlugin />
                    <Button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Submitting..." : "Comment"}
                    </Button>
                  </>
                </div>
              </div>
            </ActionsPlugin>
          </div>

          <OnChangePlugin
            ignoreSelectionChange={true}
            onChange={(editorState) => {
              onChange?.(editorState);
              onSerializedChange?.(editorState.toJSON());
            }}
          />
        </TooltipProvider>
      </LexicalComposer>
    </div>
  );
}
