import { ClearEditorPlugin } from "@lexical/react/LexicalClearEditorPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { useState } from "react";

import { ContentEditable } from "@/src/components/editor/editor-ui/content-editable";
import { ActionsPlugin } from "../../editor/plugins/actions/actions-plugin";
import { ClearEditorActionPlugin } from "../../editor/plugins/actions/clear-editor-plugin";
import { EditModeTogglePlugin } from "../../editor/plugins/actions/edit-mode-toggle-plugin";
import { CodeActionMenuPlugin } from "../../editor/plugins/code-action-menu-plugin";
import { CodeHighlightPlugin } from "../../editor/plugins/code-highlight-plugin";
import { AutoEmbedPlugin } from "../../editor/plugins/embeds/auto-embed-plugin";
import { FigmaPlugin } from "../../editor/plugins/embeds/figma-plugin";
import { YouTubePlugin } from "../../editor/plugins/embeds/youtube-plugin";
import { BlockFormatDropDown } from "../../editor/plugins/toolbar/block-format-toolbar-plugin";
import { FormatBulletedList } from "../../editor/plugins/toolbar/block-format/format-bulleted-list";
import { FormatCheckList } from "../../editor/plugins/toolbar/block-format/format-check-list";
import { FormatCodeBlock } from "../../editor/plugins/toolbar/block-format/format-code-block";
import { FormatHeading } from "../../editor/plugins/toolbar/block-format/format-heading";
import { FormatNumberedList } from "../../editor/plugins/toolbar/block-format/format-numbered-list";
import { FormatParagraph } from "../../editor/plugins/toolbar/block-format/format-paragraph";
import { FormatQuote } from "../../editor/plugins/toolbar/block-format/format-quote";
import { BlockInsertPlugin } from "../../editor/plugins/toolbar/block-insert-plugin";
import { InsertEmbeds } from "../../editor/plugins/toolbar/block-insert/insert-embeds";
import { ElementFormatToolbarPlugin } from "../../editor/plugins/toolbar/element-format-toolbar-plugin";
import { FontFamilyToolbarPlugin } from "../../editor/plugins/toolbar/font-family-toolbar-plugin";
import { FontFormatToolbarPlugin } from "../../editor/plugins/toolbar/font-format-toolbar-plugin";
import { HistoryToolbarPlugin } from "../../editor/plugins/toolbar/history-toolbar-plugin";
import { ToolbarPlugin } from "../../editor/plugins/toolbar/toolbar-plugin";

export function Plugins() {
  const [floatingAnchorElem, setFloatingAnchorElem] =
    useState<HTMLDivElement | null>(null);

  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem);
    }
  };

  return (
    <div className="relative">
      {/* toolbar plugins */}
      <ToolbarPlugin>
        {({}) => (
          <div className="vertical-align-middle sticky top-0 z-10 flex gap-2 overflow-auto border-b p-0">
            <HistoryToolbarPlugin />
            <BlockFormatDropDown>
              <FormatParagraph />
              <FormatHeading levels={["h1", "h2", "h3"]} />
              <FormatNumberedList />
              <FormatBulletedList />
              <FormatCheckList />
              <FormatQuote />
              <FormatCodeBlock />
            </BlockFormatDropDown>
            <FontFamilyToolbarPlugin />
            <FontFormatToolbarPlugin format="bold" />
            <FontFormatToolbarPlugin format="italic" />
            <FontFormatToolbarPlugin format="underline" />
            <FontFormatToolbarPlugin format="strikethrough" />
            <ElementFormatToolbarPlugin />
            <BlockInsertPlugin>
              <InsertEmbeds />
            </BlockInsertPlugin>
          </div>
        )}
      </ToolbarPlugin>

      <div className="relative">
        <RichTextPlugin
          contentEditable={
            <div className="">
              <div
                className=""
                ref={onRef}
              >
                <ContentEditable
                  placeholder={"Start typing ..."}
                  className="ContentEditable__root relative block min-h-52 max-h-64 p-3 overflow-auto focus:outline-none"
                />
              </div>
            </div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        {/* editor plugins */}
        <AutoEmbedPlugin />
        <FigmaPlugin />
        <YouTubePlugin />
        <CodeActionMenuPlugin anchorElem={floatingAnchorElem} />
        <CodeHighlightPlugin />
        <HistoryPlugin />
      </div>
      {/* actions plugins */}
      <ActionsPlugin>
        <div className="clear-both flex items-center justify-between gap-2 overflow-auto border-t p-1">
          <div className="flex flex-1 justify-start">
            {/* left side action buttons */}
          </div>
          <div>{/* center action buttons */}</div>
          <div className="flex flex-1 justify-end">
            {/* right side action buttons */}
            <>
              <ClearEditorActionPlugin />
              <ClearEditorPlugin />
              <EditModeTogglePlugin />
            </>
          </div>
        </div>
      </ActionsPlugin>
    </div>
  );
}
