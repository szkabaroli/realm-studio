////////////////////////////////////////////////////////////////////////////
//
// Copyright 2018 Realm Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
////////////////////////////////////////////////////////////////////////////

import React from 'react';
import Realm from 'realm';

import { ILoadingProgress, LoadingOverlay } from '../reusable/LoadingOverlay';
import { ImportableFile, ImportFormat } from '../../services/data-importer';

import {
  ClassFocussedHandler,
  ListFocussedHandler,
  IsEmbeddedTypeChecker,
  SingleListFocussedHandler,
} from '.';
import { AddClassModal } from './AddClassModal';
import { AddPropertyModal } from './AddPropertyModal';
import { Content, EditMode, HighlightMode } from './Content';
import { EncryptionDialog } from './EncryptionDialog';
import { Focus, IClassFocus } from './focus';
import { LeftSidebar } from './LeftSidebar';
import { NoFocusPlaceholder } from './NoFocusPlaceholder';
import { ImportDialog } from './ImportDialog';

import './RealmBrowser.scss';

export interface IRealmBrowserProps {
  classes: Realm.ObjectSchema[];
  contentKey: string;
  contentRef: (instance: Content | null) => void;
  createObjectSchema?: Realm.ObjectSchema;
  dataVersion: number;
  dataVersionAtBeginning?: number;
  allowCreate: boolean;
  editMode: EditMode;
  focus: Focus | null;
  getClassFocus: (className: string) => IClassFocus;
  getSchemaLength: (name: string) => number;
  importDialog: null | { filePaths: string[]; classNames: string[] };
  isAddClassOpen: boolean;
  isAddPropertyOpen: boolean;
  isClassNameAvailable: (name: string) => boolean;
  isEncryptionDialogVisible: boolean;
  isLeftSidebarOpen: boolean;
  isPropertyNameAvailable: (name: string) => boolean;
  onAddClass: (schema: Realm.ObjectSchema) => void;
  onAddProperty: (name: string, type: Realm.PropertyType) => void;
  onCancelTransaction: () => void;
  onClassFocussed: ClassFocussedHandler;
  onCommitTransaction: () => void;
  onHideEncryptionDialog: () => void;
  onHideImportDialog: () => void;
  onImport: (format: ImportFormat, files: ImportableFile[]) => void;
  onLeftSidebarToggle: () => void;
  onListFocussed: ListFocussedHandler;
  onSingleListFocussed: SingleListFocussedHandler;
  onOpenWithEncryption: (key: string) => void;
  onRealmChanged: () => void;
  progress: ILoadingProgress;
  realm?: Realm;
  toggleAddClass: () => void;
  toggleAddClassProperty: () => void;
  isEmbeddedType: IsEmbeddedTypeChecker;
}

export const RealmBrowser = ({
  classes,
  contentKey,
  contentRef,
  dataVersion,
  dataVersionAtBeginning,
  allowCreate,
  editMode,
  focus,
  getClassFocus,
  getSchemaLength,
  importDialog,
  isAddClassOpen,
  isAddPropertyOpen,
  isClassNameAvailable,
  isEncryptionDialogVisible,
  isLeftSidebarOpen,
  isPropertyNameAvailable,
  onAddClass,
  onAddProperty,
  onCancelTransaction,
  onClassFocussed,
  onCommitTransaction,
  onHideEncryptionDialog,
  onHideImportDialog,
  onImport,
  onLeftSidebarToggle,
  onListFocussed,
  onSingleListFocussed,
  onOpenWithEncryption,
  onRealmChanged,
  progress,
  realm,
  toggleAddClass,
  toggleAddClassProperty,
  isEmbeddedType,
}: IRealmBrowserProps) => {
  return (
    <div className="RealmBrowser">
      <LeftSidebar
        classes={classes}
        className="RealmBrowser__LeftSidebar"
        focus={focus}
        getSchemaLength={getSchemaLength}
        isOpen={isLeftSidebarOpen}
        onClassFocussed={onClassFocussed}
        onToggle={onLeftSidebarToggle}
        progress={progress}
        toggleAddClass={toggleAddClass}
        readOnly={editMode === EditMode.Disabled}
      />

      <div className="RealmBrowser__Wrapper">
        {focus && realm ? (
          <Content
            dataVersion={dataVersion}
            dataVersionAtBeginning={dataVersionAtBeginning}
            allowCreate={allowCreate}
            editMode={editMode}
            focus={focus}
            getClassFocus={getClassFocus}
            highlightMode={HighlightMode.Multiple}
            key={contentKey}
            onAddColumnClick={toggleAddClassProperty}
            onCancelTransaction={onCancelTransaction}
            onClassFocussed={onClassFocussed}
            onCommitTransaction={onCommitTransaction}
            onListFocussed={onListFocussed}
            onSingleListFocussed={onSingleListFocussed}
            onRealmChanged={onRealmChanged}
            permissionSidebar={true}
            progress={progress}
            readOnly={editMode === EditMode.Disabled}
            realm={realm}
            ref={contentRef}
            isEmbeddedType={isEmbeddedType}
          />
        ) : (
          // TODO: Use the loading overlay until Realm has fully loaded
          <NoFocusPlaceholder />
        )}
      </div>

      <AddClassModal
        isOpen={isAddClassOpen}
        isClassNameAvailable={isClassNameAvailable}
        onAddClass={onAddClass}
        toggle={toggleAddClass}
      />

      {focus && focus.kind === 'class' ? (
        <AddPropertyModal
          focus={focus}
          isOpen={isAddPropertyOpen}
          isPropertyNameAvailable={isPropertyNameAvailable}
          onAddProperty={onAddProperty}
          classes={classes}
          toggle={toggleAddClassProperty}
        />
      ) : null}

      <EncryptionDialog
        onHide={onHideEncryptionDialog}
        onOpenWithEncryption={onOpenWithEncryption}
        visible={isEncryptionDialogVisible}
      />

      <ImportDialog
        filePaths={importDialog ? importDialog.filePaths : []}
        classNames={importDialog ? importDialog.classNames : []}
        visible={importDialog !== null}
        onHide={onHideImportDialog}
        onImport={onImport}
      />

      <LoadingOverlay progress={progress} fade={true} />
    </div>
  );
};
