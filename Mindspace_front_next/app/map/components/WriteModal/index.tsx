"use client";
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import "tui-color-picker/dist/tui-color-picker.css";
import "@toast-ui/editor/dist/toastui-editor.css";
import "@toast-ui/editor/dist/toastui-editor-viewer.css";
import { WriteModalProps } from "@/constants/types";
import CustomModal from "@/components/CustomModal";
import { nodeAtom } from "@/recoil/state/nodeAtom";
import { useRecoilValue } from "recoil";
import { useUserBoardGetQuery } from "@/api/hooks/queries/board";
import WriteEditor from "./components/WriteEditor";
import ReadViewer from "./components/ReadViewer";

const WriteModal = ({
  isOpen,
  onRequestClose,
  updateNodeInfo,
}: WriteModalProps) => {
  const nodeInfo = useRecoilValue(nodeAtom);
  const [isEditing, setIsEditing] = useState(false);

  const [createBoardErrorMessage, setCreateBoardErrorMessage] =
    useState<string>("");

  const [deleteBoardErrorMessage, setDeleteBoardErrorMessage] =
    useState<string>("");

  useEffect(() => {
    if (createBoardErrorMessage) {
      alert(createBoardErrorMessage);
      setCreateBoardErrorMessage("");
    }
    if (deleteBoardErrorMessage) {
      alert(deleteBoardErrorMessage);
      setDeleteBoardErrorMessage("");
    }
  }, [createBoardErrorMessage, deleteBoardErrorMessage]);

  const {
    data: boardData,
    isLoading,
    isInitialLoading,
  } = useUserBoardGetQuery(
    nodeInfo.id as number,
    isOpen,
    nodeInfo.isWritten ?? false,
  );

  const handleClose = () => {
    setIsEditing(false);
    onRequestClose();
  };

  const commonProps = {
    onClose: handleClose,
    onEditToggle: () => setIsEditing((prevState) => !prevState),
    updateNodeInfo: updateNodeInfo,
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onRequestClose={handleClose}
      resizable
      style={{
        padding: "1rem",
      }}
    >
      {(!isInitialLoading || (isInitialLoading && !isLoading)) && (
        <>
          {nodeInfo.isWritten && !isEditing ? (
            <ReadViewer nodeData={boardData} {...commonProps} />
          ) : (
            <WriteEditor
              nodeData={isEditing ? boardData : undefined}
              {...commonProps}
            />
          )}
        </>
      )}
    </CustomModal>
  );
};

export default WriteModal;
