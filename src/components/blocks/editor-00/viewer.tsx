import { ContentEditable } from "@/src/components/editor/editor-ui/content-editable";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import type { EditorState, SerializedEditorState } from "lexical";
import { useState } from "react";
import { editorConfig } from "./editor";

export function Viewer({
  editorState,
  editorSerializedState,
  onChange,
  onSerializedChange,
}: {
  editorState?: EditorState;
  editorSerializedState?: SerializedEditorState;
  onChange?: (editorState: EditorState) => void;
  onSerializedChange?: (editorSerializedState: SerializedEditorState) => void;
}) {
  const setFloatingAnchorElem = useState<HTMLDivElement | null>(null)[1];

  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem);
    }
  };

  return (
    <LexicalComposer
      initialConfig={{
        ...editorConfig,
        ...(editorState ? { editorState } : {}),
        ...(editorSerializedState
          ? { editorState: JSON.stringify(editorSerializedState) }
          : {}),
        editable: false,
      }}
    >
      <RichTextPlugin
        contentEditable={
          <div className="">
            <div
              className=""
              ref={onRef}
            >
              <ContentEditable
                readOnly
                placeholder=""
                className="ContentEditable__root relative block prose"
              />
            </div>
          </div>
        }
        ErrorBoundary={LexicalErrorBoundary}
      />
      <OnChangePlugin
        ignoreSelectionChange={true}
        onChange={(editorState) => {
          onChange?.(editorState);
          onSerializedChange?.(editorState.toJSON());
        }}
      />
    </LexicalComposer>
  );
}
