import './index.html';
import './index.less';
import dva, { connect } from 'dva';

// 1. Initialize
const app = dva();

// 2. Plugins
//app.use({});

// 3. Model
app.model(require('./models/app'));
app.model(require('./models/item'));

// 4. Router
app.router(require('./router'));

// 5. Start
app.start('#root');
