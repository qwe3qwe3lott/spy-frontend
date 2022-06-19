import React from 'react';
import {Navigate, Outlet, Route, Routes} from 'react-router-dom';
import HomePage from './pages/HomePage';
import {default as SpyRouter} from './spy/Router';

const AppRouter: React.FC = () => {
	return (<Routes>
		<Route path={'/'} element={<Outlet/>}>
			<Route index element={<HomePage/>}/>
			<Route path={'spy/*'} element={<SpyRouter/>}/>
			<Route path={'*'} element={<Navigate to={'/'} replace/>}/>
		</Route>
	</Routes>);
};

export default AppRouter;