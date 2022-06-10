import {io, Socket} from 'socket.io-client';
import store, {AppStore} from '../store';
import {SpyWSEvents} from '../enums/SpyWSEvents';
import {Member} from '../types/Member';
import {
	clearStore,
	setFieldCards, setIAmActingFlag,
	setIAmPlayerFlag, setIsOnPauseFlag,
	setIsRunningFlag,
	setMembers, setNickname,
	setOwnerKey,
	setPlayers, setSizes, setStartConditionFlag, setTimer
} from '../store/slices/spy';
import {Player} from '../types/Player';
import {FieldCard} from '../types/FieldCard';
import {MovementDto} from '../dto/MovementDto';
import {Timer} from '../types/Timer';

class SpyAPI {
	private readonly _socket: Socket;
	get socket() { return this._socket; }
	private _store: AppStore;
	constructor(socket: Socket, store: AppStore) {
		this._socket = socket;
    	this._store = store;
	}

	init(): void {
		this._socket.on(SpyWSEvents.GET_ALL_MEMBERS, (members: Member[]) => {
			console.log(SpyWSEvents.GET_ALL_MEMBERS, members);
			this._store.dispatch(setMembers(members));
		});
		this._socket.on(SpyWSEvents.GET_OWNER_KEY, (ownerKey: string) => {
			console.log(SpyWSEvents.GET_OWNER_KEY, ownerKey);
			this._store.dispatch(setOwnerKey(ownerKey));
		});
		this._socket.on(SpyWSEvents.GET_PLAYERS, (players: Player[]) => {
			console.log(SpyWSEvents.GET_PLAYERS, players);
			this._store.dispatch(setPlayers(players));
		});
		this._socket.on(SpyWSEvents.GET_FIELD_CARDS, (fieldCards: FieldCard[]) => {
			console.log(SpyWSEvents.GET_FIELD_CARDS, fieldCards);
			this._store.dispatch(setFieldCards(fieldCards));
		});
		this._socket.on(SpyWSEvents.GET_RUNNING_FLAG, (flag: boolean) => {
			console.log(SpyWSEvents.GET_RUNNING_FLAG, flag);
			this._store.dispatch(setIsRunningFlag(flag));
		});
		this._socket.on(SpyWSEvents.GET_START_CONDITION_FLAG, (flag: boolean) => {
			console.log(SpyWSEvents.GET_START_CONDITION_FLAG, flag);
			this._store.dispatch(setStartConditionFlag(flag));
		});
		this._socket.on(SpyWSEvents.GET_ACT_FLAG, (flag: boolean) => {
			console.log(SpyWSEvents.GET_ACT_FLAG, flag);
			this._store.dispatch(setIAmActingFlag(flag));
		});
		this._socket.on(SpyWSEvents.GET_PAUSE_FLAG, (flag: boolean) => {
			console.log(SpyWSEvents.GET_PAUSE_FLAG, flag);
			this._store.dispatch(setIsOnPauseFlag(flag));
		});
		this._socket.on(SpyWSEvents.GET_SIZES, (sizes: { rows: number, columns: number }) => {
			console.log(SpyWSEvents.GET_SIZES, sizes);
			this._store.dispatch(setSizes(sizes));
		});
		this._socket.on(SpyWSEvents.GET_TIMER, (timer: Timer) => {
			console.log(SpyWSEvents.GET_TIMER, timer);
			this._store.dispatch(setTimer(timer));
		});
		this._socket.on(SpyWSEvents.GET_NICKNAME, ({ nickname, force } : { nickname: string, force: boolean }) => {
			console.log(SpyWSEvents.GET_NICKNAME, nickname);
			if (force) {
				localStorage.setItem('nickname', nickname);
				this._store.dispatch(setNickname(nickname));
				return;
			}
			const nick = localStorage.getItem('nickname');
			if (!nick) {
				this._store.dispatch(setNickname(nickname));
			} else {
				this._socket.emit(SpyWSEvents.CHANGE_NICKNAME, nick, (flag: boolean) => {
					this._store.dispatch(setNickname(flag ? nick : nickname));
				});
			}
		});
	}

	async createRoom(): Promise<string> {
		return new Promise(resolve => {
			console.log(SpyWSEvents.CREATE_ROOM);
			this._socket.emit(SpyWSEvents.CREATE_ROOM, undefined, (roomId: string) => {
				resolve(roomId);
			});
		});
	}

	async checkRoom(roomId: string) : Promise<boolean> {
		return new Promise(resolve => {
			console.log(SpyWSEvents.CHECK_ROOM, roomId);
			this._socket.emit(SpyWSEvents.CHECK_ROOM, roomId, (flag: boolean) => {
				resolve(flag);
			});
		});
	}

	async joinRoom(roomId: string) : Promise<boolean> {
		return new Promise(resolve => {
			console.log(SpyWSEvents.JOIN_ROOM, roomId);
			this._socket.emit(SpyWSEvents.JOIN_ROOM, roomId, (flag: boolean) => {
				resolve(flag);
			});
		});
	}

	become(becomePlayer: boolean) {
		console.log(SpyWSEvents.BECOME, becomePlayer);
		this._socket.emit(SpyWSEvents.BECOME, becomePlayer, (flag: boolean) => {
			if (flag) this._store.dispatch(setIAmPlayerFlag(becomePlayer));
		});
	}

	moveCards(movement: MovementDto) {
		console.log(SpyWSEvents.MOVE_CARDS, movement);
		this._socket.emit(SpyWSEvents.MOVE_CARDS, movement);
	}

	leaveRoom() {
		console.log(SpyWSEvents.LEAVE_ROOM);
		this._socket.emit(SpyWSEvents.LEAVE_ROOM, undefined, () => {
			this._store.dispatch(clearStore());
		});
	}

	startGame(ownerKey: string) {
		console.log(SpyWSEvents.START_GAME, ownerKey);
		this._socket.emit(SpyWSEvents.START_GAME, ownerKey);
	}

	pauseGame(ownerKey: string) {
		console.log(SpyWSEvents.PAUSE_GAME, ownerKey);
		this._socket.emit(SpyWSEvents.PAUSE_GAME, ownerKey);
	}

	requestTimer() {
		console.log(SpyWSEvents.REQUEST_TIMER);
		this._socket.emit(SpyWSEvents.REQUEST_TIMER);
	}

	resumeGame(ownerKey: string) {
		console.log(SpyWSEvents.RESUME_GAME, ownerKey);
		this._socket.emit(SpyWSEvents.RESUME_GAME, ownerKey);
	}

	stopGame(ownerKey: string) {
		console.log(SpyWSEvents.STOP_GAME, ownerKey);
		this._socket.emit(SpyWSEvents.STOP_GAME, ownerKey);
	}

	async changeNickname(nickname: string) : Promise<boolean> {
		return new Promise(resolve => {
			console.log(SpyWSEvents.CHANGE_NICKNAME, nickname);
			this._socket.emit(SpyWSEvents.CHANGE_NICKNAME, nickname, (flag: boolean) => {
				if (flag) {
					this._store.dispatch(setNickname(nickname));
					localStorage.setItem('nickname', nickname);
				}
				resolve(flag);
			});
		});
	}
}

const socket = io(process.env.REACT_APP_BACKEND_URL ?? '', {
	withCredentials: true
});

const spyAPI = new SpyAPI(socket, store);
spyAPI.init();
export default spyAPI;