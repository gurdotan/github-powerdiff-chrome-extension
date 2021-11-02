import React from 'react';
import { render } from 'react-dom';

import Options from './Options';
import './index.css';
import { AppTheme, lightTheme, Container, Row, Col, Card, CardInner, Button } from '@datorama/app-components';
import { ThemeProvider } from 'styled-components';


const App = () => (
	<AppTheme theme={lightTheme} provider={ThemeProvider}>
		<Container style={{ background: lightTheme.p100 }}>
			<Row>
				<Col>
					asaa
				</Col>
			</Row>
			<Row>
				<Col>
					bbb
				</Col>
			</Row>
		</Container>
	</AppTheme>
);

render(<App />, window.document.querySelector('#app-container'));
