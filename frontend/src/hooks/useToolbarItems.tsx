import { useState } from "react";

import {
  AlignLeft,
  Attachment,
  BulletList,
  Landscape,
  Link,
  Mic,
  RecordVideo,
  Smiley,
  TextBold,
  TextColor,
  TextHighlight,
  TextItalic,
  TextSize,
  TextTypo,
  TextUnderline,
} from "@edifice-ui/icons";
import {
  AccessiblePalette,
  ActionMenu,
  ActionMenuOptions,
  ColorPicker,
  DefaultPalette,
  ToolbarOptions,
  useHasWorkflow,
} from "@edifice-ui/react";
import { Editor } from "@tiptap/react";
import EmojiPicker from "emoji-picker-react";
import { useTranslation } from "react-i18next";

import TextColorExtension from "~/components/TextColorExtension.tsx/TextColorExtension";

export const useToolbarItems = (
  editor: Editor | null,
  listOptions: ActionMenuOptions[],
  alignmentOptions: ActionMenuOptions[],
) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [highlightColor, setHighlightColor] = useState<string>("");

  const { t } = useTranslation();

  const canRecord = useHasWorkflow(
    "com.opendigitaleducation.video.controllers.VideoController|view",
  );

  const toolbarItems: ToolbarOptions[] = [
    {
      action: () => console.log("on click"),
      icon: <Landscape />,
      label: "image",
      name: "image",
      className: "widget-image",
      isEnable: true,
    },
    {
      action: () => console.log("on click"),
      icon: <RecordVideo />,
      label: "video",
      name: "video",
      className: "widget-video",
      isEnable: !!canRecord,
    },
    {
      action: () => console.log("on click"),
      icon: <Mic />,
      label: "audio",
      name: "audio",
      className: "widget-audio",
      isEnable: true,
    },
    {
      action: () => console.log("on click"),
      icon: <Attachment />,
      label: "attachment",
      name: "attachment",
      className: "widget-attachment",
      isEnable: true,
    },
    {
      type: "divider",
    },
    {
      name: "text_typo",
      icon: <TextTypo />,
      label: "Choix de la famille de typographie",
      hasDropdown: false,
      /* content: (index: any, props: any) => (
            <SizeDropdown key={index} {...props} />
          ), */
      action: () => editor?.commands.setHeading({ level: 1 }),
      isActive: editor?.isActive("heading", { level: 1 }),
      isEnable: !!editor?.extensionManager.extensions.find(
        (item) => item.name === "starterKit",
      ),
    },
    {
      name: "text_size",
      icon: <TextSize />,
      label: "Choix de la taille de typographie",
      action: () => console.log("click"),
      isEnable: true,
    },
    {
      action: () => console.log("on click"),
      name: "color",
      icon: <TextColor />,
      label: "Couleur de texte",
      isActive: editor?.isActive("textStyle", {
        color: /^#([0-9a-f]{3}){1,2}$/i,
      }),
      hasDropdown: true,
      content: () => <TextColorExtension editor={editor} />,
      isEnable: !!editor?.extensionManager.extensions.find(
        (item) =>
          item.name === "color" &&
          !!editor?.extensionManager.splittableMarks.includes("textStyle"),
      ),
    },
    {
      action: () => console.log("on click"),
      name: "highlight",
      icon: <TextHighlight />,
      label: "Couleur de fond",
      isActive: editor?.isActive("highlight", {
        color: /^#([0-9a-f]{3}){1,2}$/i,
      }),
      hasDropdown: true,
      content: () => (
        <ColorPicker
          model={highlightColor}
          palettes={[
            { ...DefaultPalette, label: t("Couleur de fond") },
            { ...AccessiblePalette, label: t("Accessible palette") },
          ]}
          onChange={(color) => {
            if (color === highlightColor) {
              setHighlightColor("");
            } else {
              setHighlightColor(color);
            }
            editor?.chain().focus().toggleHighlight({ color: color }).run();
          }}
        />
      ),
      isEnable:
        !!editor?.extensionManager.splittableMarks.includes("highlight"),
    },
    {
      type: "divider",
    },
    {
      name: "bold",
      icon: <TextBold />,
      label: "Ajout de gras",
      action: () => editor?.chain().focus().toggleBold().run(),
      isActive: editor?.isActive("bold"),
      isEnable: !!editor?.extensionManager.splittableMarks.includes("bold"),
    },
    {
      name: "italic",
      icon: <TextItalic />,
      label: "Incliner le texte",
      action: () => editor?.chain().focus().toggleItalic().run(),
      isActive: editor?.isActive("italic"),
      isEnable: !!editor?.extensionManager.splittableMarks.includes("italic"),
    },
    {
      name: "underline",
      icon: <TextUnderline />,
      label: "Souligner le texte",
      action: () => editor?.chain().focus().toggleUnderline().run(),
      isActive: editor?.isActive("underline"),
      isEnable:
        !!editor?.extensionManager.splittableMarks.includes("underline"),
    },
    {
      type: "divider",
    },
    {
      name: "emoji",
      icon: <Smiley />,
      label: "Emojis",
      isActive: false,
      isEnable: true,
      action: () => console.log("click"),
      hasDropdown: true,
      content: () => (
        <EmojiPicker
          onEmojiClick={(emoji) =>
            editor?.commands.insertContentAt(
              editor.view.state.selection,
              emoji.emoji,
            )
          }
        />
      ),
    },
    {
      name: "linker",
      icon: <Link />,
      label: "Ajout d'un lien",
      isActive: editor?.isActive("linker"),
      isEnable: true,
      action: () => console.log("click"),
    },
    {
      type: "divider",
    },
    {
      action: () => console.log("on click"),
      icon: <BulletList />,
      label: "list",
      name: "list",
      hasDropdown: true,
      content: () => <ActionMenu id="action-menu-list" options={listOptions} />,
      isEnable: !!editor?.extensionManager.extensions.find(
        (item) => item.name === "starterKit",
      ),
    },
    {
      action: () => console.log("on click"),
      icon: <AlignLeft />,
      label: "alignment",
      name: "alignment",
      hasDropdown: true,
      content: () => (
        <ActionMenu id="action-menu-list" options={alignmentOptions} />
      ),
      isEnable: !!editor?.extensionManager.extensions.find(
        (item) => item.name === "textAlign",
      ),
    },
    {
      type: "divider",
    },
  ];
  return { toolbarItems, isOpen, setIsOpen };
};
