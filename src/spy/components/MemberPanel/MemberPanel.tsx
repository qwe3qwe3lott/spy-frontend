import React, {useCallback} from 'react';
import {useAppSelector} from '../../../hooks/typedReduxHooks';
import styles from './MemberPanel.module.scss';
import NicknameButton from '../NicknameButton';
import OptionsButton from '../OptionsButton';
import {selectGameIsRunning, selectIAmPlayer} from '../../store/selectors';
import {useApi} from '../../api';

const MemberPanel: React.FC = () => {
	const api = useApi();
	const iAmPlayer = useAppSelector(selectIAmPlayer);
	const gameIsRunning = useAppSelector(selectGameIsRunning);

	const becomeHandler = useCallback(() => {
		api.become(!iAmPlayer);
	}, [iAmPlayer]);

	return(<div className={styles.layout}>
		<p className={styles.title}>Панель участника</p>
		<button className={styles.button} disabled={gameIsRunning} onClick={becomeHandler}>{iAmPlayer ? 'Стать зрителем' : 'Стать игроком'}</button>
		<OptionsButton/>
		<NicknameButton/>
	</div>);
};

export default MemberPanel;