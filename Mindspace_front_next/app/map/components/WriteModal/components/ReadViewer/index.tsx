"use client";
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef } from "react";
import { Viewer } from "@toast-ui/react-editor";
import "tui-color-picker/dist/tui-color-picker.css";
import "@toast-ui/editor/dist/toastui-editor.css";
import "@toast-ui/editor/dist/toastui-editor-viewer.css";
import styles from "../../WriteModal.module.scss";

import { nodeAtom } from "@/recoil/state/nodeAtom";
import { useRecoilValue } from "recoil";
import { useDeleteBoardMutation } from "@/api/hooks/queries/board";

import { ReadViewerProps } from "@/constants/types";
import { formatDateTime, DateTimeFormat } from "@/utils/dateTime";

const ReadViewer = ({
  nodeData,
  onEditToggle,
  onClose,
  updateNodeInfo,
}: ReadViewerProps) => {
  const nodeInfo = useRecoilValue(nodeAtom);
  const viewerRef = useRef<any>(null);

  const [createBoardErrorMessage, setCreateBoardErrorMessage] =
    useState<string>("");

  const [deleteBoardErrorMessage, setDeleteBoardErrorMessage] =
    useState<string>("");

  const { mutate: deleteBoardMutation } = useDeleteBoardMutation(() => {
    updateNodeInfo(nodeInfo?.id, false);
    onEditToggle();
    onClose();
  }, setDeleteBoardErrorMessage);

  const handleDelete = () => {
    deleteBoardMutation(nodeInfo.id as number);
  };

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

  useEffect(() => {
    if (viewerRef.current) {
      viewerRef.current.getInstance().setMarkdown(nodeData?.content);
    }
  }, [nodeData?.content]);

  return (
    <>
      <div className={styles.header}>
        <button className={styles.header__button} onClick={onClose}>
          <span className={styles.header__span}>x</span>
        </button>
        <div className={styles.header__left}>
          <button className={styles.header__button} onClick={handleDelete}>
            삭제
          </button>
          <button className={styles.header__button} onClick={onEditToggle}>
            수정
          </button>
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.content__title}>
          <input disabled={false} type="text" value={nodeData.title} />

          <div className={styles.content__dateTime}>
            <span className={styles.content__date}>
              {formatDateTime(nodeData.updatedAt, DateTimeFormat.Date)}
            </span>
            <span className={styles.content__time}>
              {formatDateTime(nodeData.updatedAt, DateTimeFormat.Time)}
            </span>
          </div>
        </div>
        <div className={styles.content__editor}>
          <div
            className={`${styles.content__editor} ${styles.editor__content}`}
          >
            <div className={styles.content__viewer}>
              <Viewer
                ref={viewerRef}
                initialValue={nodeData.content}
                usageStatistics={false}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReadViewer;
