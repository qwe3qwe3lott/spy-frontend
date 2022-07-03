import React, {useCallback, useState} from 'react';
import styles from './ModalButton.module.scss';
import ModalWindow from '../ModalWindow';
import {GameApi} from '../../abstracts/GameApi';

type PropsOfForm = {
	onSuccess: () => void
	api: GameApi
}
type Props = {
    label: string
    children?: React.ReactNode
	formSet?: { form: React.FC<PropsOfForm>, api: GameApi }
    inRoomBar?: boolean
	disabled?: boolean
}
const ModalButton: React.FC<Props> = ({ children, label, inRoomBar, formSet, disabled }) => {
	const [showModal, setShowModal] = useState(false);
	const closeModalHandler = useCallback(() => {
		setShowModal(false);
	}, []);
	const openModalHandler = useCallback(() => {
		setShowModal(true);
	}, []);
	const Form = formSet?.form;
	return(<>
		<button className={inRoomBar ? styles.roomBarButton : styles.button} disabled={disabled || showModal} onClick={openModalHandler}>{label}</button>
		{showModal && <ModalWindow closeHandler={closeModalHandler} title={label}>
			{formSet && Form ? <Form onSuccess={closeModalHandler} api={formSet.api}/> : children}
		</ModalWindow>}
	</>);
};

export default ModalButton;