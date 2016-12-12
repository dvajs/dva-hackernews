import dva, { connect } from 'dva';
import createLoading from 'dva-loading';
import './index.html';
import './index.less';

// 1. Initialize
const app = dva();

// 2. Plugin
app.use(createLoading());

// 3. Model
app.model(require('./models/item'));
app.model(require('./models/user'));

// 4. Router
app.router(require('./router'));

// 5. Start
app.start('#root');
