// Copyright 2019 Superblocks AB
//
// This file is part of Superblocks Lab.
//
// Superblocks Lab is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation version 3 of the License.
//
// Superblocks Lab is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Superblocks Lab.  If not, see <http://www.gnu.org/licenses/>.

import React, { Component } from 'react';
import classNames from 'classnames';
import style from './style.less';
import { DropdownContainer } from '../common/dropdown';
import { Tooltip, HelpAction, NewProjectAction } from '../common';
import {
    IconPreferences,
    IconFork,
    IconShare,
    IconMenu,
    IconAlphabetA,
    IconLoader,
} from '../icons';
import OnlyIf from '../onlyIf';
import NetworkAccountSelector from '../networkAccountSelector';
import MenuDropdownDialog from './menu';
import ProjectTitle from './projectTitle';
import { IProject } from '../../models';

const MenuAction = () => (
    <div className={style.action}>
        <button className={classNames([style.container, 'btnNoBg'])}>
            <IconMenu />
        </button>
    </div>
);

const PreferencesAction = () => (
    <div className={classNames([style.action, style.actionRight])}>
        <Tooltip title='Preferences'>
            <button className={classNames([style.container, 'btnNoBg'])}>
                <IconPreferences />
            </button>
        </Tooltip>
    </div>
);

interface IForkDropdownActionProps {
    onForkClicked: () => void;
    isProjectForking: boolean;
}
const ForkDropdownAction = (props: IForkDropdownActionProps) => {
    const { onForkClicked, isProjectForking } = props;
    return(
        <div className={style.action}>
            <button className={classNames([style.actionFork, style.container, 'btnNoBg'])} onClick={onForkClicked} disabled={isProjectForking}>
                { isProjectForking
                    ? <IconLoader />
                    : <IconFork />
                }
                <span>Fork</span>
            </button>
        </div>
    );
};

const ShareDropdownAction = () => (
    <button className={classNames([style.container, 'btnNoBg'])}>
        <IconShare />
        <span>Share</span>
    </button>
);

interface IView {
    showOpenInLab: boolean;
    project: IProject;
}

interface IProps {
    selectedProjectName: string;
    selectedProjectId: string;
    showForkButton: boolean;
    isProjectForking: boolean;
    view: IView;
    forkProject: (projectId: string, redirect: boolean) => void;
    showModal: (modalType: string, modalProps: any) => void;
}
export default class TopBar extends Component<IProps> {

    state = {
        selectedProjectName: this.props.selectedProjectName,
        showForkButton: this.props.showForkButton,
    };

    componentDidUpdate(prevProps: IProps) {

        if (prevProps.selectedProjectName !== this.props.selectedProjectName) {
            this.setState({
                selectedProjectName: this.props.selectedProjectName
            });
        }
    }

    showModal = (modalType: string) => {
        const { showModal } = this.props;

        switch (modalType) {
            case 'preferences':
                showModal('PREFERENCES_MODAL', null);
                break;
            case 'share':
                const defaultUrl = String(window.location);
                showModal('SHARE_MODAL', { defaultUrl });
                break;
            default:
                break;
        }
    }

    onForkClicked = () => {
        const { forkProject, selectedProjectId } = this.props;
        forkProject(selectedProjectId, true);
    }

    render() {

        const { showForkButton } = this.state;
        const { project, showOpenInLab } = this.props.view;
        const { isProjectForking } = this.props;

        return (
            <div className={style.topbar}>
                <div className={style.actionsLeft}>
                    <DropdownContainer
                        className={style.actionDialogMenu}
                        dropdownContent={<MenuDropdownDialog />} >
                        <MenuAction />
                    </DropdownContainer>
                    <OnlyIf test={showOpenInLab}>
                        <a
                            className={style.openLab}
                            href={window.location.href}
                            target='_blank'
                            rel='noopener noreferrer'
                            title='Open in Lab'
                        >
                            <IconAlphabetA style={{width: 17, height: 17}} />
                            <span>Open in Lab</span>
                        </a>
                    </OnlyIf>
                    <NetworkAccountSelector />
                    <div className={style.projectActions}>
                        <OnlyIf test={showForkButton}>
                            <ForkDropdownAction
                                onForkClicked={this.onForkClicked}
                                isProjectForking={isProjectForking}
                            />
                        </OnlyIf>
                        <ShareDropdownAction />
                    </div>
                </div>
                <ProjectTitle
                    projectName={project.name}
                />
                <div className={style.actionsRight}>
                    <NewProjectAction redirect={true} />
                    <div onClick={() => this.showModal('preferences')}>
                        <PreferencesAction />
                    </div>
                    <HelpAction />
                </div>
            </div>
        );
    }
}