import React, {ReactNode, useCallback} from 'react';
import {useNavigate} from 'react-router-dom';
import styles from './GameCreateRoomPanel.module.scss';
import {GameApi} from '../../abstracts/GameApi';
import ColumnPanel from '../ColumnPanel';
import ModalButton from '../ModalButton';
import NicknameForm from '../NicknameForm';
import {GamePlayer} from '../../types/GamePlayer';
type Props = {
	api: GameApi<GamePlayer>
	gameTitle: string
	rules?: ReactNode
}
const GameCreateRoomPanel: React.FC<Props> = ({api, gameTitle, rules}) => {
	const navigate = useNavigate();
	const exitHandler = useCallback(() => {
		navigate('/');
	}, []);
	return (<ColumnPanel title={`Игра "${gameTitle}"`} hugeTitle width={15}>
		<CreateRoomButton api={api}/>
		{rules && <ModalButton label={'Правила'}>{rules}</ModalButton>}
		<ModalButton label={'Изменить ник'} formSet={{ form: NicknameForm, api }}/>
		<button className={styles.button} onClick={exitHandler}>К списку игр</button>
	</ColumnPanel>);
};

export default GameCreateRoomPanel;

type CreateRoomButtonProps = {
	api: GameApi<GamePlayer>
}
const CreateRoomButton: React.FC<CreateRoomButtonProps> = ({api}) => {
	const navigate = useNavigate();
	const createHandler = useCallback(async () => {
		const roomId = await api.createRoom();
		if (roomId) navigate(`${roomId}`);
	}, []);
	return(<button className={styles.button} onClick={createHandler}>Создать комнату</button>);
};